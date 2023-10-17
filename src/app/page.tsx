"use client";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { IFinance } from "@/interfaces/Post";
import { useRouter } from "next/navigation";
import FinanceForm from "@/components/forms/FinanceForm";
import Spinner from "@/components/Spinner";
import { BsGraphDownArrow, BsGraphUpArrow, BsListUl } from "react-icons/bs";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useFinance } from "@/providers/FinanceProvider";
import { numberToString, converterDataParaDDMMYY } from "@/utils/format";

export default function Dashboard({ params }: any) {
  const {
    finance,
    setFinance,
    loading,
    setLoading,
    year,
    setYear,
    month,
    setMonth,
    day,
    setDay,
    category,
    setCategory,
    tipo,
    setTipo,
    ordenacao,
    setOrdenacao,
    isOpen,
    setIsOpen,
  } = useFinance();
  const session = useSession();

  const username = session.data?.user?.name;

  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());
  let apiUrl = `/api/finances?username=${username}`;

  if (year && year !== "") {
    apiUrl += `&year=${year}`;
  }

  if (month && month !== "") {
    apiUrl += `&month=${month}`;
  }

  if (day && day !== "") {
    apiUrl += `&day=${day}`;
  }

  const { data, mutate, error, isLoading } = useSWR(apiUrl, fetcher);

  const router = useRouter();

  const handleSubmit = async (data: Partial<IFinance>) => {
    setLoading(true);
    try {
      await fetch("api/finances", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          value: data.value,
          tipo: data.tipo,
          category: data.category,
          date: data.date,
          username: session.data!.user!.name,
        }),
      });
      setLoading(false);
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (data: Partial<IFinance>) => {
    setLoading(true);
    try {
      await fetch(`/api/finances/${finance!._id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: data.title,
          value: data.value,
          tipo: data.tipo,
          category: data.category,
          date: data.date,
          username: session.data!.user!.name,
        }),
      });
      setLoading(false);
      mutate();
    } catch {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    setFinance(null);
    try {
      await fetch(`/api/finances/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch {
      console.log(error);
    }
  };

  let totalEntradas = 0;
  let totalSaidas = 0;

  data?.forEach((teste: IFinance) => {
    if (teste.tipo) {
      // Se for uma entrada (teste.tipo === true), adicione ao total de entradas
      totalEntradas += teste.value;
    } else {
      // Se for uma saída (teste.tipo === false), adicione ao total de saídas
      totalSaidas += teste.value;
    }
  });

  if (session.status === "loading") {
    return <Spinner />;
  }
  if (session.status === "unauthenticated") {
    router.push("/login");
  }
  if (session.status === "authenticated") {
    return (
      <div
        onClick={() => setIsOpen(false)}
        className="page-container  overflow-x-hidden overflow-y-auto"
      >
        <div className="flex flex-col w-full h-full shadow-md shadow-gray-900/20 rounded-bl-lg ">
          <div className="flex text-xs uppercase text-gray-400">
            <div className="item-data w-full bg-gray-800/50 rounded-tl-lg">
              Titulo
            </div>
            <div className="item-data dark:bg-gray-900/20 w-20">Tipo</div>
            <div className="hidden lg:block item-data w-32 bg-gray-800/50">
              Data
            </div>
            <div className="item-data hidden lg:block  w-56 dark:bg-gray-900/20">
              Categoria
            </div>
            <div className="item-data bg-gray-800/50 w-64">Valor</div>
            <div className="item-data  w-24">Editar</div>
          </div>
          <div className="flex flex-col">
            {data
              ?.filter((finance: IFinance) =>
                finance.category.toLowerCase().includes(category.toLowerCase())
              )
              .filter(
                (finance: IFinance) => tipo === null || finance.tipo === tipo
              )
              .sort((a: IFinance, b: IFinance) => {
                if (ordenacao === "valorCrescente") {
                  return a.value - b.value;
                } else if (ordenacao === "valorDecrescente") {
                  return b.value - a.value;
                } else {
                  return a.date.localeCompare(b.date);
                }
              })
              .map((teste: IFinance) => (
                <div key={teste._id} className="border-b flex  border-gray-700">
                  <div className="item-data w-full font-medium whitespace-nowrap text-white bg-gray-800/40">
                    {teste.title.length > 27
                      ? teste.title.substring(0, 27) + "..."
                      : teste.title}
                  </div>
                  <div className="item-data w-20">
                    {teste.tipo ? (
                      <div className="flex pl-1 w-full font-bold text-xl text-green-600">
                        <BsGraphUpArrow />
                      </div>
                    ) : (
                      <div className="flex pl-1 w-full font-bold text-xl text-red-600">
                        <BsGraphDownArrow />
                      </div>
                    )}
                  </div>
                  <div className="hidden w-32 lg:block item-data bg-gray-800/40">
                    {converterDataParaDDMMYY(teste.date)}
                  </div>
                  <div className="item-data hidden w-56 lg:block">
                    {teste.category}
                  </div>
                  <div className="item-data bg-gray-800/40 w-64">
                    R$ {numberToString(teste.value)}
                  </div>

                  <div className="item-data w-24  font-bold text-xl gap-1">
                    <button
                      className=" hover:text-indigo-600"
                      onClick={() => setFinance(teste)}
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      className=" hover:text-red-600"
                      onClick={() => handleDelete(teste._id)}
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex h-full">
            <div className="item-data h-full w-full bg-gray-800/40 rounded-bl-lg"></div>
            <div className="item-data h-full w-20"></div>
            <div className="item-data hidden lg:block h-full w-32 bg-gray-800/40"></div>
            <div className="item-data hidden lg:block h-full w-56 "></div>
            <div className="item-data h-full w-64 bg-gray-800/40"></div>
            <div className="item-data h-full w-24 text-gray-200/0">-</div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col lg:h-full gap-2 w-full lg:w-1/3">
          {" "}
          <div
            onClick={() => setFinance(null)}
            className="hidden lg:flex text-xs justify-start p-2 pt-3 gap-1 items-center flex-col w-[31%] lg:w-full bg-gray-800/40 shadow-md shadow-gray-900/20 rounded-tl-lg lg:rounded-tl-none  lg:rounded-tr-lg"
          >
            <p className="font-semibold">ORDEM / FILTRO</p>
            <div className="flex w-full gap-1 my-0.5">
              <button
                className="black-button flex items-center justify-center "
                onClick={() => setOrdenacao("valorDecrescente")}
              >
                Decr.
              </button>
              <button
                className="black-button flex items-center justify-center "
                onClick={() => setOrdenacao("valorCrescente")}
              >
                Cresc.
              </button>
              <button
                className="black-button flex  items-center justify-center ordenacao === 'dataCrescente' ? 'dark:bg-blue-600 text-white' : ''"
                onClick={() => setOrdenacao("dataCrescente")}
              >
                Data
              </button>
            </div>
            <div className="flex w-full gap-1">
              <select
                className="input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Nenhum</option>
                <option value="01">Janeiro</option>
                <option value="02">Fevereiro</option>
                <option value="03">Março</option>
                <option value="04">Abril</option>
                <option value="05">Maio</option>
                <option value="06">Junho</option>
                <option value="07">Julho</option>
                <option value="08">Agosto</option>
                <option value="09">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
              <select
                className="input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="flex w-full gap-1 my-0.5">
              <button
                className="black-button flex text-blue-600 items-center justify-center text-xl font-extrabold"
                onClick={() => setTipo(null)}
              >
                <BsListUl />
              </button>
              <button
                className="black-button flex text-green-600 items-center justify-center text-xl font-extrabold"
                onClick={() => setTipo(true)}
              >
                <BsGraphUpArrow />
              </button>
              <button
                className="black-button flex text-red-600 items-center justify-center text-xl font-extrabold"
                onClick={() => setTipo(false)}
              >
                <BsGraphDownArrow />
              </button>
            </div>
            <div className="w-full">
              <select
                className="input"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="dark:text-gray-600">
                  Categoria
                </option>

                <>
                  <option value="Salario">Salario</option>
                  <option value="Freelancer">Freelancer</option>
                </>

                <>
                  {" "}
                  <option value="Alimentação">Alimentação</option>
                  <option value="Gasolina">Gasolina</option>
                </>
              </select>
            </div>
          </div>
          <div className="flex w-full">
            {finance ? (
              <FinanceForm
                formSubmit={handleUpdate}
                data={finance}
                nameButton="Editar"
              />
            ) : (
              <FinanceForm formSubmit={handleSubmit} nameButton="Adicionar" />
            )}
          </div>
          <div className="flex flex-col gap-1 w-[448px] lg:h-full lg:w-full">
            <div className="flex w-full gap-1 px-0.5 lg:hidden">
              <select
                className="input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Nenhum</option>
                <option value="01">Janeiro</option>
                <option value="02">Fevereiro</option>
                <option value="03">Março</option>
                <option value="04">Abril</option>
                <option value="05">Maio</option>
                <option value="06">Junho</option>
                <option value="07">Julho</option>
                <option value="08">Agosto</option>
                <option value="09">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
              <select
                className="input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="flex justify-between px-4  items-center w-full h-1/3 bg-gray-800/40 shadow-md shadow-gray-900/20 rounded-tr-lg lg:rounded-none">
              <h1>Rec:</h1>
              <h1>R$ {numberToString(totalEntradas)}</h1>
            </div>

            <div className="flex justify-between px-4 items-center w-full h-1/3 shadow-md">
              <h1>Des:</h1>
              <h1>R$ {numberToString(totalSaidas)}</h1>
            </div>
            <div className="flex justify-between px-4 items-center w-full h-1/3 bg-gray-800/40 shadow-md shadow-gray-900/20 lg:rounded-br-lg">
              <h1>Sal:</h1>
              <h1>R$ {numberToString(totalEntradas - totalSaidas)}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
