// /components/Navbar.tsx
import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Button from "./Button";
import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="w-full bg-preto-opaco bg-opacity-100">
      <nav className="flexBetween max-container padding-container relative z-30 py-5">
        <Link
          href="/"
          className="font-logoSuave text-white font-bold text-4xl leading-none hover:font-extrabold hover:text-black ease-in-out"
        >
          Nexus
        </Link>
        <ul className="hidden h-full gap-12 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.href}
              key={link.key}
              className="font- text-white text-bold flexCenter cursor-pointer pb-1.5 transition-all text-lg hover:font-extrabold hover:text-extrabold ease-in-out"
            >
              {link.label}
            </Link>
          ))}
        </ul>
        <div className="lg:flexCenter hidden">
          {/* Botão Entrar como link */}
          <Link href="/check-email">
            <Button
              type="button"
              title="Entrar"
              icon="/user.svg"
              variant="btn_dark_gray"
            />
          </Link>
        </div>

        <Image
          src="/menu.svg"
          alt="menu"
          width={24}
          height={24}
          className="inline-block cursor-pointer lg:hidden"
        />
      </nav>
    </div>
  );
};

export default Navbar;
