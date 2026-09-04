import * as React from "react";
import {
  ButtonVariantProps,
  pagination,
  type PaginationVariantProps,
} from "@styled/recipes";
import { Button } from "lib/main";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useCallback } from "react";

export type PaginationProps = PaginationVariantProps & {
  /** *(optional)*
   * The value of the current page.
   * @default 1
   */
  page?: number;

  /** *(optional)*
   * Callback when the page changes.
   */
  onPageChange?: (page: number) => void;

  /** *(optional)*
   * Whether to show the "first" and "last" page buttons.
   * @default false
   */
  showFirstLast?: boolean;

  /** *(optional)*
   * Whether to show the "previous" and "next" page buttons.
   * @default false
   */
  showPrevNext?: boolean;

  /** *(optional)*
   * Whether to show the numbered pages.
   * @default true
   */
  showPageNumbers?: boolean;

  /** *(optional)*
   * The color scheme used by the component.
   * @default "primary"
   * */
  variant?: ButtonVariantProps["variant"];

  /** *(optional)*
   * The maximum number of visible pages.
   * @default 5
   */
  maxVisiblePages?: number;

  /** The total number of items. */
  totalItems: number;

  /** *(optional)*
   * The number of items per page.
   * @default 10
   */
  itemsPerPage?: number;

  /** *(optional)*
   * The content of the first button.
   * @default <DoubleArrowLeftIcon height={21} />
   */
  firstButtonContent?: React.ReactNode;

  /** *(optional)*
   * The content of the last button.
   * @default <DoubleArrowRightIcon height={21} />
   */
  lastButtonContent?: React.ReactNode;

  /** *(optional)*
   * Whether to hide the navigation button when disabled.
   * @default false
   */
  hideNavigationOnDisabled?: boolean;
};

/**
 * Provides ability to change the visible content in a table.
 *
 * @param page - *(optional)* The value of the current page.
 * @param onPageChange - *(optional)* Callback when the page changes.
 * @param showFirstLast - *(optional)* Whether to show the "first" and "last" page buttons.
 * @param showPrevNext - *(optional)* Whether to show the "previous" and "next" page buttons.
 * @param showPageNumbers - *(optional)* Whether to show the numbered pages.
 * @param variant - *(optional)* The color scheme used by the component.
 * @param maxVisiblePages - *(optional)* The maximum number of visible pages.
 * @param totalItems - The total number of items.
 * @param itemsPerPage - *(optional)* The number of items per page.
 * @param firstButtonContent - *(optional)* The content of the first button.
 * @param lastButtonContent - *(optional)* The content of the last button.
 * @param hideNavigationOnDisabled - *(optional)* Whether to hide the navigation button when disabled.
 */

export const Pagination: React.FC<PaginationProps> = ({
  page = 1,
  totalItems,
  onPageChange,
  itemsPerPage = 10,
  showFirstLast = false,
  showPrevNext = false,
  showPageNumbers = true,
  hideNavigationOnDisabled = false,
  maxVisiblePages = 5,
  firstButtonContent = <DoubleArrowLeftIcon height={21} />,
  lastButtonContent = <DoubleArrowRightIcon height={21} />,
  ...props
}) => {
  const classes = pagination();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const resolveCurrentPage = useCallback(() => {
    if (!page || page < 1) return 1;
    if (page > totalPages) return totalPages;
    return page;
  }, [page, totalPages]);

  React.useEffect(
    () => setCurrentPage(resolveCurrentPage()),
    [page, resolveCurrentPage],
  );

  const [currentPage, setCurrentPage] = React.useState(resolveCurrentPage());

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        onPageChange?.(newPage);
      }
    },
    [totalPages, onPageChange],
  );

  // This block renders the correct number of pages based on the current page
  const buttons = React.useMemo(() => {
    const pagesPerSide = Math.floor(maxVisiblePages / 2);
    let numberIndex = currentPage - pagesPerSide;

    const pagesLeft = totalPages - currentPage;
    if (pagesLeft < pagesPerSide) numberIndex -= pagesPerSide - pagesLeft;
    numberIndex = Math.max(1, numberIndex);

    const pages: number[] = [];

    for (
      let i = 0;
      i < maxVisiblePages && numberIndex <= totalPages;
      numberIndex++, i++
    ) {
      pages.push(numberIndex);
    }

    return pages.map((page) => (
      <Button
        variant={props.variant}
        key={page}
        onClick={() => handlePageChange(page)}
        size="xs"
        disabled={currentPage === page}
      >
        {page.toString()}
      </Button>
    ));
  }, [
    currentPage,
    totalPages,
    maxVisiblePages,
    props.variant,
    handlePageChange,
  ]);

  const shouldShowNavButton = (
    showCondition: boolean,
    disabledCondition: boolean,
  ) => {
    if (!showCondition) return false;
    if (disabledCondition && hideNavigationOnDisabled) return false;
    return true;
  };

  return (
    <div className={classes.root} {...props}>
      {shouldShowNavButton(showFirstLast, isFirstPage) && (
        <Button
          variant={props.variant}
          onClick={() => handlePageChange(1)}
          disabled={isFirstPage}
          size="xs"
          data-testid="First"
        >
          {firstButtonContent}
        </Button>
      )}
      {shouldShowNavButton(showPrevNext, isFirstPage) && (
        <Button
          variant={props.variant}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          size="xs"
          data-testid="Prev"
        >
          <ChevronLeftIcon height={21} />
        </Button>
      )}
      {showPageNumbers && buttons.map((button) => button)}
      {shouldShowNavButton(showPrevNext, isLastPage) && (
        <Button
          variant={props.variant}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          size="xs"
          data-testid="Next"
        >
          <ChevronRightIcon height={21} />
        </Button>
      )}
      {shouldShowNavButton(showFirstLast, isLastPage) && (
        <Button
          variant={props.variant}
          size="xs"
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
          data-testid="Last"
        >
          {lastButtonContent}
        </Button>
      )}
    </div>
  );
};

Pagination.displayName = "Pagination";
