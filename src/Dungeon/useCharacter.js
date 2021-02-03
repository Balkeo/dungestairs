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
            let newCharacter = {
                ...previousCharacter,
                hp: previousCharacter.hp - damage
            };
            if (newCharacter.hp <= 0) {
                newCharacter.hp = 0;
            }
            return newCharacter;
        });
    }

    return { character, takeDamage };
}