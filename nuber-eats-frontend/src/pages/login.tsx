import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/formError";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
interface ILoginForm {
  email: string;
  password: string;
  resultError?: string;
}

// DTO를 이용한 grapql 스키마를 프론트 타입으로 쓸 수 있다
// 이렇게 스키마 타입을 쓰고 codegen을 하면 globalType으로 넣어준다
// 서버에서 DTO를 수정하면 바로 타입 에러가 나고 버그 찾을 수 있다
export const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;
// mutation 뒤에 붙은 이름과 변수 선언은 오직 프론트앤드를 위한것
// $를 붙이면 apollo가 프론트 변수라고 확인

export const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: "onChange",
  });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;

    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    // update
    // A function used to update the cache after a mutation occurs
    // 첫번째 인자로 캐쉬 인스턴스 두번째 인자로 data 가 들어간다
    // onError
    // 에러시에 동작하는 콜백
    onCompleted: onCompleted,
    // 완료시에 동작하는 콜백, argument로 data 들어간다
  });
  // loginMutation은 트리거 함수, data는 mutation으로 반환되는 데이터

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img src={nuberLogo} className='w-52 mb-10' />
        <h4 className='w-full font-medium text-left text-3xl mb-5'>
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 w-full mb-5'>
          <input
            ref={register({
              required: "Email is required",
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name='email'
            required
            type='email'
            placeholder='Email'
            className='input'
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            required
            name='password'
            type='password'
            placeholder='Password'
            className='input'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"Log in"}
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
          <div>
            New to Nuber?{" "}
            <Link
              to='/create-account'
              className='text-green-600 hover:underline'>
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
