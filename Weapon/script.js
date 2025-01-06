function generateRandomScore(max) {
    return Math.random() * max;
}

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
        <p><strong>Attack:</strong> ${weapon.attack.toFixed(2)}</p>
        <p><strong>Critical Chance:</strong> ${weapon.critChance.toFixed(2)}%</p>
        <p><strong>Critical Damage:</strong> ${weapon.critDamage.toFixed(2)}%</p>
        <p><strong>Total Score:</strong> ${weapon.value.toFixed(2)}</p>
        ${weapon.enchant ? `<p><strong>Enchant:</strong> ${weapon.enchant.name} - ${weapon.enchant.effect}</p>` : ""}
    `;
}

function renderWeaponList() {
    const weapons = loadWeaponsFromStorage();
    const weaponListDiv = document.getElementById('weapons');
    weaponListDiv.innerHTML = '';

    weapons.forEach((weapon, index) => {
        const weaponDiv = document.createElement('div');
        weaponDiv.className = 'weapon-item';

        const weaponInfo = document.createElement('span');
        weaponInfo.textContent = `Weapon ${index + 1}: Atk ${weapon.attack.toFixed(2)}, 
        Crit% ${weapon.critChance.toFixed(2)}%, 
        CritDmg ${weapon.critDamage.toFixed(2)}%, 
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
    const maxAttackScore = 50;
    const maxCritChanceScore = 25;
    const maxCritDamageScore = 25;

    const baseAttack = 100; // 기본 공격력
    const baseCritChance = 5; // 기본 치명타 확률 (%)
    const baseCritDamage = 50; // 기본 치명타 피해 (%)

    const attackScore = generateRandomScore(maxAttackScore);
    const critChanceScore = generateRandomScore(maxCritChanceScore);
    const critDamageScore = generateRandomScore(maxCritDamageScore);

    let attack = baseAttack * (1 + (attackScore - 25) * 0.01);
    let critChance = baseCritChance + (critChanceScore - 12.5) * 0.2;
    let critDamage = baseCritDamage + (critDamageScore - 12.5) * 0.3;

    // 7% 확률로 인챈트 추가
    let enchant = null;
    if (Math.random() < 0.07) {
        const enchants = [
            { name: "Fire", effect: "Adds burn damage over time." },
            { name: "Ice", effect: "Slows the enemy." },
            { name: "Lightning", effect: "Chance to stun the enemy." },
            { name: "Sharpness", effect: "Increases attack power by 10%." },
            { name: "Lifesteal", effect: "Heals a portion of damage dealt." },
        ];
        enchant = enchants[Math.floor(Math.random() * enchants.length)];

        // 인챈트에 따른 능력치 강화
        if (enchant.name === "Sharpness") {
            attack *= 1.1;
        }
    }

    let value = (attack * (1 - critChance * 0.01) + (attack * (1 + critDamage * 0.01)) * (critChance * 0.01)) ** 2 / 50;
    value *= enchant ? 1.5 : 1.0;

    const weapon = { attack, critChance, critDamage, value, enchant };

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

function sortWeaponsByScore() {
    const weapons = loadWeaponsFromStorage();
    weapons.sort((a, b) => b.value - a.value);
    saveWeaponsToStorage(weapons);
    renderWeaponList();
}

function clearWeaponList() {
    localStorage.removeItem('weapons');
    renderWeaponList();
}

// 초기화 시 무기 목록 렌더링
document.addEventListener('DOMContentLoaded', renderWeaponList);