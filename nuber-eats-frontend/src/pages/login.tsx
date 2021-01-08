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
}

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`; // mutation 뒤에 붙은 이름과 변수 선언은 오직 프론트앤드를 위한것
// $를 붙이면 apollo가 변수라고 확인

export const Login = () => {
  const [loginMutation, { loading, error, data }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION);
  // loginMutation은 트리거 함수, data는 mutation으로 반환되는 데이터

  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const onSubmit = () => {
    const { email, password } = getValues(); // useForm 이 submit 된 object 리턴
    loginMutation({
      variables: {
        email,
        password,
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
        </form>
      </div>
    </div>
  );
};
