"use client";
import { useState, useEffect } from "react";
import { IFinance } from "@/interfaces/Post";
import { FinanceResolver } from "@/utils/validators";
import { useForm } from "react-hook-form";
import Input from "../Input";

import ToggleSwitch from "../ToggleSwitch";
import { useFinance } from "@/providers/FinanceProvider";
import Spinner from "../Spinner";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";

type FinanceFormProps = {
  data?: Partial<IFinance>;
  formSubmit: (data: Partial<IFinance>) => void;
  nameButton: string;
};

//Formulario para cadastro de animais
const FinanceForm: React.FC<FinanceFormProps> = ({
  data = {},
  formSubmit,
  nameButton,
}) => {
  const { finance, setFinance, loading, setLoading } = useFinance();

  function numberToString(number?: number) {
    const string = number?.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
    return string;
  }
  function letrasMaiusculas(str: string) {
    return str.toUpperCase();
  }

  const formMethods = useForm<IFinance>({ resolver: FinanceResolver as any });
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    watch,
  } = formMethods;

  const title = watch("title");
  const category = watch("category");
  const tipo = watch("tipo");
  const date = watch("date");
  const [valor, setValor] = useState(
    data.value ? data.value.toString().replace(".", ",") : ""
  );

  const handleSetData = (data: IFinance) => {
    setValue("title", data.title || "");
    setValue("category", data.category || "");
    if (data.category === "Sem Categoria") {
      setValue("category", "");
    }
    setValor(numberToString(data.value) || "");
    setValue("date", data.date || "");
    setValue("tipo", data.tipo || false);
  };
  const handleRemoveData = () => {
    setValue("title", "");
    setValue("category", "");
    setValor("");
    setValue("date", "");
    setValue("tipo", false);
    setFinance(null);
  };

  useEffect(() => {
    setValue("title", letrasMaiusculas(title || ""));
  }, [title]);

  useEffect(() => {
    setValue("category", "");
  }, [tipo]);

  useEffect(() => {
    if (finance) {
      handleSetData(finance);
    }
    if (!finance) {
      handleRemoveData();
    }
  }, [finance]);

  const dataAtual = new Date();

  const submitForm = (values: IFinance) => {
    let finalDate;
    let finalCategory;
    if (!date) {
      finalDate = formatarDataParaString(dataAtual);
    } else {
      finalDate = date;
    }
    if (!category) {
      finalCategory = "-";
    } else {
      finalCategory = category;
    }
    formSubmit({
      title,
      category: finalCategory,
      tipo: values.tipo,
      value: Number(valor.replace(",", ".")),
      date: finalDate,
    });
    handleRemoveData();
  };

  function formatarDataParaString(data: Date): string {
    const ano = String(data.getFullYear());
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Lembre-se de que os meses são base 0
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  const handleValorChange = (inputValor: string) => {
    const decimalPart = inputValor.split(",")[1];

    if (
      inputValor === "" ||
      (!isNaN(Number(inputValor.replace(",", "."))) &&
        (!decimalPart || decimalPart.length <= 2))
    ) {
      setValor(inputValor);
    }
  };

  return (
    <div className="flex w-full">
      <form
        onSubmit={handleSubmit(submitForm)}
        className="flex w-full flex-col gap-1"
      >
        <Input
          type="text"
          {...register("title")}
          placeholder="Titulo"
          error={errors?.title?.message}
        />
        <div className="flex w-full flex-row lg:flex-col gap-1 justify-center items-center">
          <Input
            type="text"
            {...register("value")}
            placeholder="Valor"
            value={valor}
            onChange={(e) => handleValorChange(e.target.value)}
            error={errors?.value?.message}
          />

          <ToggleSwitch register={register} tipo={tipo} />
        </div>
        <div className="flex w-full flex-row lg:flex-col justify-center gap-1 items-center">
          <div className="w-full px-1">
            <select className="input" {...register("category")}>
              <option value="" className="dark:text-gray-600">
                Categoria
              </option>
              {tipo ? (
                <>
                  <option value="Salario">Salario</option>
                  <option value="Freelancer">Freelancer</option>
                </>
              ) : (
                <>
                  {" "}
                  <option value="Alimentação">Alimentação</option>
                  <option value="Gasolina">Gasolina</option>
                </>
              )}
            </select>
            {errors?.category?.message && (
              <p className="text-xs text-red-600">
                {errors?.category?.message}
              </p>
            )}
          </div>
          <Input type="date" {...register("date")} />
        </div>
        <button
          onClick={handleSubmit(submitForm)}
          type="submit"
          className="btn w-full"
        >
          {loading ? <Spinner /> : nameButton}
        </button>
      </form>
    </div>
  );
};

export default FinanceForm;
