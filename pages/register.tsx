/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";


const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    if(!name) {
      setError("Le nom est obligatoire");
      return;
    }

    if (!isValidEmail(email)) {
      setError("L'email est invalide");
      return;
    }

    if (!password || password.length < 8) {
      setError("Le mot de passe doit avoir au moins 8 caractères");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne sont pas identiques");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.status === 400) {
        setError("Cet email est déja utilisé");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Erreur, veuillez réessayer");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1 className="flex min-h-screen flex-col items-center justify-between p-24">Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="lg:flex lg:justify-between lg:items-center sm:flex sm:items-center sm:justify-center md:flex md:justify-center md:items-center sm:w-full md:w-full">
      <form onSubmit={handleSubmit} className="flex justify-center flex-col items-center w-[100vh] h-[100vh]">
        <h1 className="text-5xl font-bold p-5 text-center">S&apos;enregistrer</h1>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold">Nom</span>
          </label>
          <input
            type="text"
            placeholder="Nom"
            className="input input-bordered input-md w-full max-w-xs bg-[#ff3c3c]/30 placeholder:text-[#494949] border-none"
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered input-md w-full max-w-xs bg-[#ff3c3c]/30 placeholder:text-[#494949] border-none"
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold">Mot de passe</span>
          </label>
          <input
            type="password"
            placeholder="Mot de passe"
            className="input input-bordered input-md w-full max-w-xs bg-[#ff3c3c]/30 placeholder:text-[#494949] border-none"
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold">
              Confirmez le mot de passe
            </span>
          </label>
          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            className="input input-bordered input-md w-full max-w-xs bg-[#ff3c3c]/30 placeholder:text-[#494949] border-none"
          />
        </div>

        <button className="btn bg-[#ff3c3c] font-semibold py-2 px-4 my-6 hover:bg-[#ff3c3c] hover:transform hover:scale-105 transition duration-150 ease-in-out rounded-lg">
          S&apos;enregistrer
        </button>

        <div className="sm:text-center">
          <p>
            Vous avez déjà un compte ?{" "}
            <a className="text-[#ff3c3c]" href="/login">
              Connectez-vous!
            </a>
          </p>
        </div>
      <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
      </form>
    </div>
    )
  );
};

export default Register;

