import Link from 'next/link';
import React from 'react';
import { Button } from '@headlessui/react';
import Search from '@/components/search';

function Home() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex justify-center items-center p-7 m-auto">
        <nav className="flex justify-between items-center gap-8">
          <h1 className="font-poppins text-2xl font-ultrabold absolute left-7">
            ZAYMA
          </h1>
          <ul className="flex justify-between items-center gap-8">
            <li className="font-sans">
              <Link href="/">Accueil</Link>
            </li>
            <li className="text-sans">
              <Link href="/product">Produits</Link>
            </li>
            <li className="text-sans">
              <Link href="/favories">Favories</Link>
            </li>
            <li className="text-sans">
              <Link href="/commandes">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>
              </Link>
            </li>
            <li>
              <Search />
            </li>
            <li className="absolute right-7">
              <Link href="/login">
                <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                  Login
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Home;
