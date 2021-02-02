import { useState } from "react";

import characters from "../Content/Characters";
import {calculate} from "../Helper/SkillCalculator";

export const useCharacter = (selectedCharacter = 0) => {
    const selectCharacter = () => {
        let character = Object.assign({}, characters[selectedCharacter]);
        return calculate(character);
    }

    let [character, setCharacter] = useState(() => selectCharacter());

    const takeDamage = (damage = 0) => {
        setCharacter((previousCharacter) => {
            return {
                ...previousCharacter,
                hp: previousCharacter.hp - damage
            };
        });
    }

    return { character };
}