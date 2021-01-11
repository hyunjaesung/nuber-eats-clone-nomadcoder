import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData, refetch } = useMe();
  const client = useApolloClient(); // 아폴로 client 가지고 오기
  const history = useHistory();
  const onCompleted = async (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      //   // 캐쉬 write 해서 헤더에 있는 verify email 경고 해제

      //   client.writeFragment({
      //     // fragment는 type의 일부분 의미, 여기서는 User의 일부분
      //     id: `User:${userData.me.id}`,
      //     // 아폴로는 그래프 QL 모델 + 해당 모델의 id 가 있으면 합쳐서 id 만들어서 캐쉬 만든다
      //     fragment: gql`
      //       fragment VerifiedUser on User {
      //         verified
      //       }
      //     `, // VerifiedUser 는 내가 알아서 쓰면되고
      //     // User는 api에서 가지고 오니 맞춰야한다
      //     // 전체 모델에서 우리가 바꾸고 싶은 일부분
      //     // 내부에는 우리가 User안에서 뭐를 수정하고 싶은지 쓴다
      //     data: {
      //       // send 할 data
      //       verified: true,
      //     },
      //   });
      await refetch(); // me query문
      history.push("/");
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );

  useEffect(() => {
    const [_, code = ""] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [verifyEmail]);

  return (
    <div className='mt-52 flex flex-col items-center justify-center'>
      <Helmet>
        <title>Verify Email | Nuber Eats</title>
      </Helmet>
      <h2 className='text-lg mb-1 font-medium'>Confirming email...</h2>
      <h4 className='text-gray-700 text-sm'>
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
