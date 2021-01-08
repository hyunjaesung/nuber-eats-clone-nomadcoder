import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/formError";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

interface ILoginForm {
  email: string;
  password: string;
  resultError?: string;
}

// DTO를 이용한 grapql 스키마를 프론트 타입으로 쓸 수 있다
// 이렇게 스키마 타입을 쓰고 codegen을 하면 globalType으로 넣어준다
// 서버에서 DTO를 수정하면 바로 타입 에러가 나고 버그 찾을 수 있다
const LOGIN_MUTATION = gql`
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
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();

  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  const [loginMutation, { data: loginMutationResult }] = useMutation<
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
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className='h-screen flex items-center justify-center bg-gray-800'>
      <div className='bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center'>
        <h3 className='text-2xl text-gray-800'>Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 px-5'>
          <input
            ref={register({ required: "Email is required" })}
            name='email'
            required
            type='email'
            placeholder='Email'
            className='input'
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            ref={register({ required: "Password is required", minLength: 10 })}
            required
            name='password'
            type='password'
            placeholder='Password'
            className='input'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage='Password must be more than 10 chars.' />
          )}
          <button className='mt-3 btn'>Log In</button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
