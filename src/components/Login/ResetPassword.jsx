import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserCircleIcon } from "@heroicons/react/outline";
import LoadingButton from "@mui/lab/LoadingButton";
import { login, reset } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputValidation from "../FormField/InputValidation";
import { getOtpResetPassword } from "../../api";

const ResetPassword = ({ formData, setToken, setPage, setUsername}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const schema = yup.object().shape({
    username: yup.string().required(t("usernameRequired")),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const onSubmit = ({ username }) => {
    // const newFormData = { username };

    const getToken = async () => {
        try {
            const response = getOtpResetPassword(username)
            response.then(res => {
                console.log(res)
                setToken(res.data.token)
                setPage(1)
                setUsername(username)
            }).catch(e => {
                toast.error('user not exist')
                // console.log(e)
            })
    
        }catch(e) {
            // console.log(e)
        }

    }

    getToken()
    // dispatch(login(newFormData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      navigate(from, { replace: true });
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <>
      <form className="relative pt-[50px]" onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="absolute top-[30px] w-full text-center">
          <div className="mx-auto inline-flex items-center justify-center gap-1 rounded-lg bg-gray-200 px-2 py-1 text-sm">
            <UserCircleIcon className="w-4" /> {formData.username}
          </div>
        </div> */}
        <div className="mb-16">
          <InputValidation
            id="username"
            type="username"
            label={t("username")}
            {...register("username")}
            errors={errors.username}
            placeholder={t("username")}
            autoFocus
          />
        </div>
        <div className="mt-8">
          <LoadingButton
            variant="contained"
            type="submit"
            fullWidth
            loading={isLoading}
          >
            {t("Next")}
          </LoadingButton>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
