# ProcGenTest

절차적 맵, 아이템 생성 테스트

## 무기 생성 시스템

- 가상의 무기를 생성하고 공격력, 치명타 확률/피해량을 기준으로 정렬해 놓을 수 있게 한 테스트 시스템이다.
- 무기는 등급, 공격력 계수, 강화 수치, 공격력, 치명타 확률, 치명타 피해, 부속성, 인챈트 스탯이 있다.
- 등급은 일반, 고급, 희귀, 에픽, 전설의 5등급으로 나뉘고, 등급이 높을 수록 공격력 계수가 높아진다.
- 부속성은 원소 내성/공격 증가, 치명타 확률/피해 추가 증가, 더블 어택 확률이 있다.
- 강화 수치는 +20까지 있으며 강화 수치에 따라 공격력이 증가하고 +4강마다 치명타 확률, 치명타 피해, 부속성 중 하나가 임의로 증가한다.
- 인챈트 스탯은 무기에 추가적인 효과를 제공한다.

### 무기 생성 과정 (상세)

1. 무기 등급 설정
    - 일반 60%, 고급 30%, 희귀 7%, 에픽 2.5%, 전설 0.5%의 비율로 설정된다.
2. 등급에 따른 공격력 계수 설정
    - 일반 : x1 ~ 1.15
    - 고급 : x1.15 ~ 1.3
    - 희귀 : x1.3 ~ 1.6
    - 에픽 : x1.6 ~ 1.9
    - 전설 : x1.9 ~ 2.3
    - 각 등급 안에서 범위 내 배율이 나올 확률은 동일하다.
3. 부속성과 시작 수치 설정
   - 원소 피해 증가, 원소 내성, 추가 치명타 확률, 추가 치명타 피해, 더블 어택 확률 중 하나를 고른다. (각 속성의 등장 확률은 20%로 동일)
   - 속성마다 정해져 있는 시작 수치가 4가지가 있는데, 그 중 하나를 고른다. 각 수치의 등장 확률은 동일하다.
   - 원소 피해 증가 : 9, 10.5, 12, 13.5%
   - 더블 어택 확률 : 3.5, 4.5, 5.5, 6.5%
   - 추가 치명타 확률 : 2, 2.7, 3.4, 4.1%
   - 추가 치명타 피해 : 10, 13, 16, 19%
   - 원소 내성 증가 : 5, 6.1, 7.2, 8.3%
4. 강화 수치 설정
   - +20강의 확률을 k라고 하면, +19강은 2k, +18강은 3k, ... , +1강은 20k, +0강은 21k로 설정한다.
   - 이 확률의 합은 231k = 1, k = 1/231이 된다.
   - 즉 +20강이 나올 확률은 1/231 = 0.4329%이다.
5. 강화 진행
   - 무기의 공격력은 $$50+(rein \times 5) + \left\lfloor \frac{rein^{2}}{4} \right\rfloor$$ 에 공격력 계수를 곱한 값이 된다.
   - 강화 수치가 4의 배수에 도달할 때마다 치명타 피해, 치명타 확률, 부속성 중 하나가 증가한다.
   - 증가하는 수치는 속성마다 정해진 6개의 수치 중 하나를 임의로 가져온다. 6가지 수치의 등장 확률은 동일하다.
   - 치명타 확률(추가 치명타 확률) : 0.9, 1.1, 1.3, 1.5, 1.7, 1.9%
   - 치명타 피해(추가 치명타 피해) : 3, 4, 5, 6, 7, 8%
   - 원소 피해 증가 : 3, 3.4, 3.8, 4.2, 4.6, 5%
   - 더블 어택 확률 : 1.2, 1.5, 1.8, 2.1, 2.4, 2.7%
   - 원소 내성 증가 : 3, 3.4, 3.8, 4.2, 4.6, 5%
6. 인챈트 설정
   - 8%의 확률로 원소 부여 3가지, 날카로움(공격력 증가), 흡혈 중 하나의 인챈트를 부여한다. 확률은 동일하다.
7. 무기의 가치 계산
   - 치명타를 고려한 무기의 공격력 수치에 1.5 제곱을 한 뒤 10으로 나눈 것을 무기의 가치로 한다.
   - $$\frac{(atk \times (1-critChance) + atk \times critChance \times (1 + critDamage))^{1.5}}{10}$$
   - 인챈트가 적용되어 있으면 계산된 가치에 1.5를 곱한다.

## 던전 생성

- 랜덤 워크, 셀룰러 오토마타, 미로 생성, 방-복도 구조, BSP 알고리즘을 사용하여 100x100 그리드에 임의의 던전을 만들어낸다.
