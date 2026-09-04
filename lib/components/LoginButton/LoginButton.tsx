import * as React from "react";
import { loginButton, type LoginButtonVariantProps } from "@styled/recipes";
import googleIcon from "./providerIcon/google_icon.svg";
import microsoftIcon from "./providerIcon/microsoft_icon.svg";
import { useMemo } from "react";
import { LOGIN_PROVIDERS } from "lib/utils/constants";

export type LoginButtonProps = LoginButtonVariantProps &
  React.ComponentProps<"button"> & {
    /**
     * The login provider.
     * Options: 'google', 'microsoft'
     */
    provider: (typeof LOGIN_PROVIDERS)[keyof typeof LOGIN_PROVIDERS];
  };

/**
 * A button that performs the login operation.
 *
 * @param provider - The login provider. Options: 'google', 'microsoft'.
 * @param children - The button's content.
 */

export const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  provider,
  ...props
}) => {
  const classes = loginButton();

  const providerIcon = useMemo(() => {
    switch (provider) {
      case "google":
        return googleIcon;
      case "microsoft":
        return microsoftIcon;
    }
  }, [provider]);

  return (
    <button className={classes.root} {...props}>
      <img className={classes.icon} src={providerIcon} alt={`${provider}`} />
      <p className={classes.text}>{children}</p>
    </button>
  );
};

LoginButton.displayName = "LoginButton";
