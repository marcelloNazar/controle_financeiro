import React from "react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { UseFormRegister } from "react-hook-form";

interface ToggleSwitchProps {
  tipo: boolean;
  register: UseFormRegister<any>; // UseFormRegister para o tipo apropriado
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ tipo, register }) => {
  return (
    <div className="flex w-full p-1 justify-center gap-4 items-center">
      <div className="flex justify-end items-end w-full font-bold text-3xl text-red-600">
        {!tipo ? <BsGraphDownArrow /> : <></>}
      </div>

      <label
        htmlFor="toggle-switch"
        className="flex items-center justify-center"
      >
        <input
          type="checkbox"
          id="toggle-switch"
          {...register("tipo")} // Use o registro diretamente aqui
          defaultChecked={tipo} // Defina o estado inicial com base em 'tipo'
          className="cursor-pointer h-8 w-16 rounded-full appearance-none bg-white bg-opacity-5 border-2 border-red-600 checked:border-green-600 checked:bg-gray-600 transition duration-200 relative"
        />
      </label>

      <div className="flex justify-start items-center w-full font-bold text-3xl text-green-600">
        {tipo ? <BsGraphUpArrow /> : <></>}
      </div>
    </div>
  );
};

export default ToggleSwitch;
