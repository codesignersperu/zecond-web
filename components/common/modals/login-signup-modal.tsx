"use client";

import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ASSETS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { API } from "@/lib/apis";
import { API_BASE_URL } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin, useSignup } from "@/lib/mutations";
import { useEffect, useState } from "react";
import { useModalStore, Modal } from "@/lib/stores";

export default function LoginSignupModal() {
  const { currentOpenedModal, closeModal, openModal } = useModalStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const t = useTranslations();
  const login = useLogin();
  const signup = useSignup();

  // Login Form
  const loginFormSchema = z.object({
    email: z
      .string({ message: t("modals.login.email-required") })
      .email({ message: t("modals.login.email-invalid") }),
    password: z
      .string({ message: t("modals.login.password-required") })
      .min(8, { message: t("modals.login.password-length") })
      .max(100),
  });

  type LoginFormData = z.infer<typeof loginFormSchema>;
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup Form
  const signupFormSchema = z
    .object({
      firstName: z
        .string({ message: t("modals.signup.firstName-required") })
        .min(3, { message: t("modals.signup.firstName-length") }),
      lastName: z
        .string({ message: t("modals.signup.lastName-required") })
        .min(3, { message: t("modals.signup.lastName-length") }),
      email: z
        .string({ message: t("modals.signup.email-required") })
        .email({ message: t("modals.signup.email-invalid") }),
      password: z
        .string({ message: t("modals.signup.password-required") })
        .min(8, { message: t("modals.signup.password-length") })
        .max(100),
      confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("modals.signup.passwords-mismatch"),
          path: ["confirmPassword"],
        });
      }
    });

  type SignupFormData = z.infer<typeof signupFormSchema>;
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  useEffect(() => {
    if (login.isSuccess || signup.isSuccess) {
      loginForm.reset();
      signupForm.reset();
      closeModal();
    }
  }, [login.isSuccess, signup.isSuccess]);

  function onSubmit(data: any) {
    mode === "login" ? login.mutate(data) : signup.mutate(data);
  }

  function onOAuthLogin(provider: "google" | "apple" | "facebook") {
    let url = API_BASE_URL + "/";

    switch (provider) {
      case "google":
        url += API.auth.googleLogin;
        break;
      case "apple":
        return toast("Apple Login will be added");
        break;
      case "facebook":
        return toast("Facebook Login will be added");
        break;
    }

    window.open(url, "_self");
  }

  return (
    <Dialog
      open={currentOpenedModal === Modal.LoginSignup}
      onOpenChange={closeModal}
    >
      <DialogContent
        className="max-w-[350px] sm:max-w-[480px] px-[30px] sm:px-[60px] py-[30px] bg-modal-gradient
        !rounded-[20px]"
      >
        {/* Close Button */}
        <DialogClose className="absolute w-7 h-7 sm:w-10 sm:h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Image
            src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
            alt="Close Modal"
            width={14}
            height={14}
            className="w-[10px] h-[10px] sm:w-[10px] sm:h-[10px]"
          />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="text-center space-y-6">
          {/* Logo & Heading */}
          <div className="flex justify-center">
            <Image
              src={ASSETS["zecond-logo-black.png"] || "/placeholder.svg"}
              alt="ZECOND Logo"
              width={120}
              height={60}
              className="w-36 sm:w-48"
            />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-lg font-semibold text-[#1C1C1C] tracking-wide leading-[1.1] sm:leading-tight">
              {mode === "login"
                ? t("modals.login.heading")
                : t("modals.signup.heading")}
            </DialogTitle>
            <p className="text-xs sm:text-sm text-[#1C1C1C] tracking-wide leading-tight">
              {mode === "login"
                ? t("modals.login.sub-heading")
                : t("modals.signup.sub-heading")}
            </p>
          </div>
        </DialogHeader>

        {mode === "login" ? (
          <Form {...loginForm}>
            <form
              className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
              onSubmit={loginForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("modals.login.email-or-phone-number")}
                        className="w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("modals.login.password")}
                        className="w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full rounded-full h-[44px] border border-black bg-black hover:bg-black/90"
                type="submit"
                disabled={login.isPending}
              >
                {t("common.continue")}
              </Button>
              <p className="text-sm text-center w-full font-bold text-[#737373]">
                {t("modals.login.don't-have-an-account")}{" "}
                <button
                  className="underline"
                  onClick={() => setMode("signup")}
                  type="button"
                >
                  {t("modals.login.signup")}
                </button>
              </p>
              <button
                className="text-sm text-center w-full font-bold text-[#737373] hover:underline"
                onClick={() => openModal({ modal: Modal.ForgetPassword })}
                type="button"
              >
                {t("modals.login.trouble-logging-in")}
              </button>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form
              className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
              onSubmit={signupForm.handleSubmit(onSubmit)}
            >
              <div className="flex gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t("modals.signup.firstName")}
                          className="flex-1 w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t("modals.signup.lastName")}
                          className="flex-1 w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("modals.signup.email-or-phone-number")}
                        className="w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("modals.signup.password")}
                        className="w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("modals.signup.confirm-password")}
                        className="w-full bg-transparent rounded-full focus:outline-none h-[44px] border border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full rounded-full h-[44px] border border-black bg-black hover:bg-black/90"
                type="submit"
                disabled={signup.isPending}
              >
                {t("common.continue")}
              </Button>
              <p className="text-sm text-center w-full font-bold text-[#737373]">
                {t("modals.signup.already-have-an-account")}{" "}
                <button
                  className="underline"
                  onClick={() => setMode("login")}
                  type="button"
                >
                  {t("modals.signup.login")}
                </button>
              </p>
            </form>
          </Form>
        )}

        <div className="mt-2 sm:mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 leading-none bg-[#FFFCF3] text-gray-500">
              O
            </span>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 flex justify-center items-center gap-8">
          <Button
            variant="outline"
            className="w-auto p-0 bg-transparent border-none hover:bg-transparent"
            onClick={() => onOAuthLogin("google")}
          >
            <Image
              src={ASSETS["google.png"] || "/placeholder.svg"}
              alt="Google"
              width={32}
              height={32}
            />
          </Button>
          <Button
            variant="outline"
            className="w-auto p-0 bg-transparent border-none hover:bg-transparent"
            onClick={() => onOAuthLogin("facebook")}
          >
            <Image
              src={ASSETS["facebook.png"] || "/placeholder.svg"}
              alt="Facebook"
              width={32}
              height={32}
            />
          </Button>
          <Button
            variant="outline"
            className="w-auto p-0 bg-transparent border-none hover:bg-transparent"
            onClick={() => onOAuthLogin("apple")}
          >
            <Image
              src={ASSETS["apple.png"] || "/placeholder.svg"}
              alt="Apple"
              width={32}
              height={32}
            />
          </Button>
        </div>

        <p className="mt-4 text-xs text-center font-bold text-[#969696]">
          {t.rich("modals.login.captcha-para", {
            anchor1: (chunk) => (
              <a
                href="https://policies.google.com/privacy"
                className="hover:underline"
                target="_blank"
              >
                {chunk}
              </a>
            ),
            anchor2: (chunk) => (
              <a
                href="https://policies.google.com/terms"
                className="hover:underline"
                target="_blank"
              >
                {chunk}
              </a>
            ),
          })}
        </p>
      </DialogContent>
    </Dialog>
  );
}
