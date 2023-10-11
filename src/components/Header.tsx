"use client";

import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { useFinance } from "@/providers/FinanceProvider";

export default function Header() {
  const { isOpen, setIsOpen } = useFinance();
  const links = [
    {
      id: 1,
      title: "",
      url: "/",
    },
  ];
  const session = useSession();
  const username = session.data?.user?.name;
  const firstName = username?.split(" ")[0];
  const imageUrl = session.data?.user?.image;

  return (
    <div className="flex  w-full py-2 justify-between items-center">
      <>Controle Finaceiro</>
      <div className="flex items-center gap-4 ">
        {links.map((link) => (
          <Link key={link.id} href={link.url} className="">
            {link.title}
          </Link>
        ))}
        {session.status === "authenticated" && (
          <div className="flex flex-col items-center">
            <button
              className="flex items-center rounded-full border-2 border-transparent active:border-gray-200 duration-200 hover:text-gray-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Image
                className="rounded-full"
                src={imageUrl!}
                alt="Descrição da imagem"
                width={36} // Largura da imagem em pixels
                height={36} // Altura da imagem em pixels
              />
              {!isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
            </button>
            {isOpen && (
              <div className="flex absolute justify-end mr-20 mt-12">
                <div className="flex flex-col w-32 h-52 rounded-lg p-2 border bg-gray-50 dark:bg-gray-950">
                  <div className="flex flex-col justify-center h-full gap-4 border-b mb-2">
                    <div className="flex justify-center">
                      <Image
                        className="rounded-full"
                        src={imageUrl!}
                        alt="Descrição da imagem"
                        width={70} // Largura da imagem em pixels
                        height={70} // Altura da imagem em pixels
                      />
                    </div>
                    <div className="flex justify-center">Olá, {firstName}!</div>
                  </div>
                  <button
                    className="hover:text-white"
                    onClick={() => signOut()}
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
