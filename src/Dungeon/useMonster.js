import { useState } from "react";

import monsters from "../Content/Monsters";
import {calculate} from "../Helper/SkillCalculator";
import {random} from "../Helper/Utils";

export const useMonster = (level = 1) => {
    const selectMonster = () => {
        let monster = Object.assign({}, monsters[random(monsters.length)]);
        monster.level = level;
        monster = calculate(monster);
        return monster;
    }

    let [Monster, setMonster] = useState(() => selectMonster());

    const monsterTakeDamage = (damage = 0) => {
        setMonster((previousMonster) => {
            return {
                ...previousMonster,
                hp: previousMonster.hp - damage
            };
        });
    }

    return Monster;
}