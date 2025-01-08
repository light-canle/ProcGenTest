const Rank = {
    COMMON : "common",
    UNCOMMON : "uncommon",
    RARE : "rare",
    EPIC : "epic",
    LEGENDARY : "legendary",
};
Object.freeze(Rank);


function saveWeaponsToStorage(weapons) {
    localStorage.setItem('weapons', JSON.stringify(weapons));
}

function loadWeaponsFromStorage() {
    const weapons = localStorage.getItem('weapons');
    return weapons ? JSON.parse(weapons) : [];
}

function showWeaponInformation(weapon){
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h2>Weapon Infomation</h2>
        <p><strong>Rank:</strong> ${weapon.rank} (x${weapon.attackMultiplyer.toFixed(2)})</p>
        <p><strong>Reinforcement:</strong> +${weapon.reinforcement}</p>
        <p><strong>Attack:</strong> ${weapon.attack.toFixed(2)}</p>
        <p><strong>Critical Chance:</strong> ${weapon.critChance.toFixed(2)}%</p>
        <p><strong>Critical Damage:</strong> ${weapon.critDamage.toFixed(2)}%</p>
        <p><strong>${weapon.subStatName}</strong> : ${weapon.subStatValue.toFixed(2)}%</p>
        <p><strong>Value:</strong> ${weapon.value.toFixed(2)}</p>
        ${weapon.enchant ? `<p><strong>Enchant:</strong> ${weapon.enchant.name} - ${weapon.enchant.effect}</p>` : ""}
    `;
}

function renderWeaponList() {
    const weapons = loadWeaponsFromStorage();
    const weaponListDiv = document.getElementById('weapons');
    weaponListDiv.innerHTML = '';

    weapons.forEach((weapon, index) => {
        const weaponDiv = document.createElement('div');
        weaponDiv.classList.add('weapon-item');
        switch (weapon.rank)
        {
            case Rank.UNCOMMON : weaponDiv.classList.add("uncommon"); break;
            case Rank.RARE : weaponDiv.classList.add("rare"); break;
            case Rank.EPIC : weaponDiv.classList.add("epic"); break;
            case Rank.LEGENDARY : weaponDiv.id = weaponDiv.classList.add("legendary"); break;
        }
        

        const weaponInfo = document.createElement('span');
        weaponInfo.textContent = `Weapon ${index + 1}: ${weapon.rank}(+${weapon.reinforcement}) - 
        ${weapon.attack.toFixed(2)}/ 
        ${weapon.critChance.toFixed(2)}%/ 
        ${weapon.critDamage.toFixed(2)}%,  
        ${weapon.enchant ? weapon.enchant.name : ""}`;

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.onclick = () => {
            showWeaponInformation(weapon);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            const weapons = loadWeaponsFromStorage();
            weapons.splice(index, 1);
            saveWeaponsToStorage(weapons);
            renderWeaponList();
        };

        weaponDiv.appendChild(weaponInfo);
        weaponDiv.appendChild(viewButton);
        weaponDiv.appendChild(deleteButton);
        weaponListDiv.appendChild(weaponDiv);
    });
}

function generateSingleWeapon(){
    const weapon = generateWeapon();
    const weapons = loadWeaponsFromStorage();
    weapons.push(weapon);
    saveWeaponsToStorage(weapons);

    renderWeaponList();

    showWeaponInformation(weapon);
}

function generateWeapon() {
    // 1. 등급 설정
    const rankScore = Math.random();

    const rankFunc = (rankScore) => {
        if (rankScore < 0.005) return Rank.LEGENDARY;
        else if (rankScore < 0.03) return Rank.EPIC;
        else if (rankScore < 0.1) return Rank.RARE;
        else if (rankScore < 0.4) return Rank.UNCOMMON;
        else return Rank.COMMON;
    };
    const rank = rankFunc(rankScore);

    // 2. 등급에 따른 공격력 계수 설정
    const atkMulFunc = (rank) => {
        switch (rank)
        {
            case Rank.COMMON: return RandomUtil.NextDouble(1.0, 1.15);
            case Rank.UNCOMMON: return RandomUtil.NextDouble(1.15, 1.3);
            case Rank.RARE: return RandomUtil.NextDouble(1.3, 1.6);
            case Rank.EPIC: return RandomUtil.NextDouble(1.6, 1.9);
            case Rank.LEGENDARY: return RandomUtil.NextDouble(1.9, 2.3);
            default: return 1;
        }
    };
    const attackMultiplyer = atkMulFunc(rank);
    // 3. 부속성 지정
    const SubStatList = [
        { name : "elementDamage", type : ["ice", "water", "fire", "electrical"], startValue : [9, 10.5, 12, 13.5], increasingValue : [3, 3.4, 3.8, 4.2, 4.6, 5] }, 
        { name : "doubleAttackChance", startValue : [3.5, 4.5, 5.5, 6.5], increasingValue : [1.2, 1.5, 1.8, 2.1, 2.4, 2.7] },
        { name : "criticalChance", startValue : [2, 2.7, 3.4, 4.1], increasingValue : [0.9, 1.1, 1.3, 1.5, 1.7, 1.9] },
        { name : "criticalDamage", startValue : [10, 13, 16, 19], increasingValue : [3, 4, 5, 6, 7, 8] },
        { name : "elementResistance", type : ["ice", "water", "fire", "electrical"], startValue : [5, 6.1, 7.2, 8.3], increasingValue : [3, 3.4, 3.8, 4.2, 4.6, 5] },
    ];
    
    const subStatInfo = RandomUtil.Choice(SubStatList);
    const subStatName = subStatInfo.name;
    let subStatValue = RandomUtil.Choice(subStatInfo.startValue);

    // 4. 강화 수치 지정
    const reinforceScore = Math.random();

    const reinforceFunc = (score) => {
        const prob = (100 / 231) / 100;
        let rein = 20;
        let sumProb = prob;
        while (score >= sumProb)
        {
            rein--;
            sumProb += prob * (21 - rein);
        }
        return rein;
    };

    const reinforcement = reinforceFunc(reinforceScore);

    // 5. 강화 진행
    let attack = 50 + (reinforcement * 5) + Math.floor((reinforcement ** 2) / 4);
    attack *= attackMultiplyer;
    let critChance = 5
    let critDamage = 50;

    // +4마다 부가 속성이나 치명타 관련 속성 강화
    const reinTime = Math.floor(reinforcement / 4);
    for (let i = 0; i < reinTime; i++)
    {
        const toUpgrade = RandomUtil.Choice(["crit%", "critDmg", "subStat"]);
        switch (toUpgrade)
        {
            case "crit%": 
                critChance += RandomUtil.Choice([0.9, 1.1, 1.3, 1.5, 1.7, 1.9]);
                break;
            case "critDmg":
                critDamage += RandomUtil.Choice([3, 4, 5, 6, 7, 8]);
                break;
            case "subStat":
                subStatValue += RandomUtil.Choice(subStatInfo.increasingValue);
                break;
        }
    }

    // subStat이 치명타 관련인 경우 반영
    if (subStatName == "criticalChance")
    {
        critChance += subStatValue;
    }
    else if (subStatName == "criticalDamage")
    {
        critDamage += subStatValue;
    }

    // 6. 인챈트 부여
    let enchant = null;
    if (Math.random() < 0.08) {
        const enchantList = [
            { name: "Fire", effect: "Adds burn damage over time." },
            { name: "Ice", effect: "Slows the enemy." },
            { name: "Lightning", effect: "Chance to stun the enemy." },
            { name: "Sharpness", effect: "Increases attack power by 10%." },
            { name: "Lifesteal", effect: "Heals a portion of damage dealt." },
        ];
        enchant = enchantList[Math.floor(Math.random() * enchants.length)];

        // 인챈트에 따른 능력치 강화
        if (enchant.name === "Sharpness") {
            attack *= 1.1;
        }
    }

    // 7. 가치 계산
    let value = (attack * (1 - critChance * 0.01) + (attack * (1 + critDamage * 0.01)) * (critChance * 0.01)) ** 1.5 / 10;
    value *= enchant ? 1.5 : 1.0;

    const weapon = { attack, critChance, critDamage, 
        rank, attackMultiplyer, 
        subStatName, subStatValue, 
        reinforcement, value, enchant };

    return weapon;
}

function generateMultipleWeapons() {
    const countInput = document.getElementById('weaponCount');
    const count = parseInt(countInput.value);

    if (isNaN(count) || count <= 0) {
        alert('Please enter a valid number of weapons to generate.');
        return;
    }

    const weapons = loadWeaponsFromStorage();
    for (let i = 0; i < count; i++)
    {
        weapons.push(generateWeapon());
    }

    saveWeaponsToStorage(weapons);

    renderWeaponList();
}

function sortWeaponsByValue() {
    const weapons = loadWeaponsFromStorage();
    weapons.sort((a, b) => b.value - a.value);
    saveWeaponsToStorage(weapons);
    renderWeaponList();
}

function sortWeaponsByCritChance() {
    const weapons = loadWeaponsFromStorage();
    weapons.sort((a, b) => b.critChance - a.critChance);
    saveWeaponsToStorage(weapons);
    renderWeaponList();
}

function sortWeaponsByCritDamage() {
    const weapons = loadWeaponsFromStorage();
    weapons.sort((a, b) => b.critDamage - a.critDamage);
    saveWeaponsToStorage(weapons);
    renderWeaponList();
}

function sortWeaponsByAttack() {
    const weapons = loadWeaponsFromStorage();
    weapons.sort((a, b) => b.attack - a.attack);
    saveWeaponsToStorage(weapons);
    renderWeaponList();
}

function clearWeaponList() {
    localStorage.removeItem('weapons');
    renderWeaponList();
}

// 초기화 시 무기 목록 렌더링
document.addEventListener('DOMContentLoaded', renderWeaponList);