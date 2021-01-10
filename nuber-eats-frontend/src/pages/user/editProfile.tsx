import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { resolveProjectReferencePath } from "typescript";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData, refetch } = useMe();
  const client = useApolloClient();

  const onCompleted = async (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      // update the cache
      // 첫번째 방법
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();

      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }

      // 두번째 방법

      // await refetch();
      // editProfile 후 변경된 me query문 다시 호출
      // 캐싱된 데이터 전부 바뀌고 헤더에 다시 경고문 뜨게 된다
      // useMe 될 때마다 me query 문 호출 하게 되고 이 데이터로 뭔가 그리는데
      // 두번째 방법은 한번 더 호출
      // 더 느린 경우가 당연히 많다
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className='mt-52 flex flex-col justify-center items-center'>
      <h4 className='font-semibold text-2xl mb-3'>Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'>
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name='email'
          className='input'
          type='email'
          placeholder='Email'
        />
        <input
          ref={register}
          name='password'
          className='input'
          type='password'
          placeholder='Password'
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Save Profile'
        />
      </form>
    </div>
  );
};
