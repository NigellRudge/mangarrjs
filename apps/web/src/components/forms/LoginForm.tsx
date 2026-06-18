import { Formik, Form } from "formik";
import { object, string } from "yup";

import useAuth from "@/hooks/useAuth";
import Icon from "@/components/shared/Icon";

const LoginForm = () => {
  const { login, authError } = useAuth();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async ({ email, password }) => await login(email, password)}
      validationSchema={object({
        email: string().email().max(100).required(),
        password: string().min(8).max(100).required(),
      })}
    >
      {({
        errors,
        values,
        handleChange,
        isSubmitting,
        handleBlur,
        submitForm,
        touched,
      }) => {
        const hasEmailError = Boolean(errors?.email) && Boolean(touched.email);
        const hasPasswordError =
          Boolean(errors?.password) && Boolean(touched.password);

        return (
          <div className="w-full">
            <Form className="flex flex-col gap-8 w-full">
              <div className="flex flex-col">
                <label
                  className={`${hasEmailError ? "input-error" : ""} input w-full outline-none h-[45px]`}
                >
                  <Icon name="userFilled" size={20} className="text-gray-300" />
                  <input
                    type="text"
                    id="email"
                    placeholder="Email address or Username"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`w-full bg-transparent text-base font-medium placeholder-gray-500 ${hasEmailError ? "text-red-400" : "text-gray-200"} text-gray-200`}
                  />
                </label>

                {errors.email && <span className=""></span>}
              </div>
              <div className="flex flex-col w-full  h-[45px]">
                <label
                  className={`${hasPasswordError ? "input-error" : ""} input w-full outline-none h-[45px] pr-0 overflow-hidden`}
                >
                  <Icon name="show" size={20} className="text-gray-300" />
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-transparent placeholder-gray-500 ${hasPasswordError ? "text-red-400" : "text-gray-200"} text-base font-medium`}
                  />
                </label>
              </div>
              {Boolean(authError) && (
                <div className="flex flex-col p-2">
                  <span className="text-red-300 text-md font-semibold">
                    {authError}
                  </span>
                </div>
              )}

              <div className="flex w-full ">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => submitForm()}
                  className="h-12 text-gray-800 btn btn-primary w-full text-lg rounded-md border font-semibold"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <span className="flex flex-row gap-4">
                      <Icon name="login" size={24} className="text-gray-800" />
                      Login
                    </span>
                  )}
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
