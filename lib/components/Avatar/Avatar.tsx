import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { avatar, type AvatarVariantProps } from "@styled/recipes";

export type AvatarProps = AvatarVariantProps &
  React.ComponentProps<typeof AvatarPrimitive.Root> & {
    /** *(optional)*
     * The full name used to generate initials for the avatar fallback.
     */
    name?: string;

    /** *(optional)*
     * The URL of the avatar image.
     */
    src?: string;

    /** *(optional)*
     * Alternative text description for the avatar image.
     */
    alt?: string;
  };

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  const firstInitial = words[0]?.[0] || "";
  const lastInitial = words.length > 1 ? words[words.length - 1]?.[0] : "";
  return (firstInitial + lastInitial).toUpperCase();
};

/**
 * An image element with a fallback for representing the user.
 *
 * @param src - *(optional)* The source URL of the avatar image.
 * @param alt - *(optional)* Alternative text description of the image.
 * @param name - *(optional)* The name of the user, used to generate initials for the fallback.
 * @param children - *(optional)* Content to display when no image or name is provided.
 * @param size - *(optional)* The size of the tooltip component. Options: 'sm', 'md', 'lg', 'xl.
 * @param backgroundColor - *(optional)* The background color of the avatar. Options: 'red', 'green', 'blue', 'purple', 'yellow', 'gray', 'white', 'transparent'.
 * @param textColor - *(optional)* The text color of the avatar. Options: 'red', 'green', 'blue', 'purple', 'yellow', 'gray', 'white', 'transparent'.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  children,
  name,
  size,
  backgroundColor,
  textColor,
  ...props
}) => {
  const classes = avatar({ size, backgroundColor, textColor });

  return (
    <AvatarPrimitive.Root className={classes.root} {...props}>
      <AvatarPrimitive.Image src={src} alt={alt} className={classes.image} />
      <AvatarPrimitive.Fallback className={classes.fallback}>
        {name ? getInitials(name) : children}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};
