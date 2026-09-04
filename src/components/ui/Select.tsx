import {
  Check,
  ChevronDown,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectProps = {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  allLabel?: string;
  disabled?: boolean;
  className?: string;
};

const ALL_VALUE = "__all__";

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  allLabel,
  disabled = false,
  className = "",
}: SelectProps) {
  const id = useId();

  const rootRef =
    useRef<HTMLDivElement>(null);

  const optionRefs =
    useRef<
      Record<
        string,
        HTMLLIElement | null
      >
    >({});

  const [open, setOpen] =
    useState(false);

  const displayOptions = useMemo(
    () =>
      allLabel
        ? [ALL_VALUE, ...options]
        : options,
    [allLabel, options],
  );

  const selectedIndex = useMemo(
    () => {
      if (
        value === "All" &&
        allLabel
      ) {
        return 0;
      }

      const index =
        options.indexOf(value);

      if (index < 0) {
        return 0;
      }

      return allLabel
        ? index + 1
        : index;
    },
    [allLabel, options, value],
  );

  const selectedLabel = useMemo(
    () => {
      if (
        value === "All" &&
        allLabel
      ) {
        return allLabel;
      }

      if (value === "All") {
        return placeholder;
      }

      return (
        options.find(
          (option) =>
            option === value,
        ) ?? placeholder
      );
    },
    [
      allLabel,
      options,
      placeholder,
      value,
    ],
  );

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] = useState(selectedIndex);

  const selectOption =
    useCallback(
      (option: string) => {
        const nextValue =
          option === ALL_VALUE
            ? "All"
            : option;

        onChange(nextValue);
        setOpen(false);
      },
      [onChange],
    );

  /*
   * Close when the user clicks or taps outside
   * the select component.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      const target =
        event.target;

      if (
        target instanceof Node &&
        !rootRef.current?.contains(
          target,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, [open]);

  /*
   * Keyboard navigation is attached only while the
   * menu is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        setOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setHighlightedIndex(
          (current) =>
            Math.min(
              current + 1,
              displayOptions.length - 1,
            ),
        );

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setHighlightedIndex(
          (current) =>
            Math.max(
              current - 1,
              0,
            ),
        );

        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        setHighlightedIndex(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();

        setHighlightedIndex(
          displayOptions.length - 1,
        );

        return;
      }

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        const option =
          displayOptions[
            highlightedIndex
          ];

        if (option) {
          selectOption(option);
        }
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    displayOptions,
    highlightedIndex,
    open,
    selectOption,
  ]);

  /*
   * Keep the highlighted option visible while
   * navigating a long list with the keyboard.
   *
   * This effect only touches the DOM; it does not
   * synchronously update React state.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const option =
      displayOptions[
        highlightedIndex
      ];

    if (!option) {
      return;
    }

    optionRefs.current[
      option
    ]?.scrollIntoView({
      block: "nearest",
    });
  }, [
    displayOptions,
    highlightedIndex,
    open,
  ]);

  function openMenu() {
    if (disabled) {
      return;
    }

    /*
     * Set the starting highlight as part of the
     * user interaction that opens the menu instead
     * of synchronizing it from an effect.
     */
    setHighlightedIndex(
      selectedIndex,
    );

    setOpen(true);
  }

  function handleTriggerKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) {
    if (disabled) {
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openMenu();

      if (
        event.key === "ArrowUp"
      ) {
        setHighlightedIndex(
          Math.max(
            selectedIndex - 1,
            0,
          ),
        );
      }

      if (
        event.key === "ArrowDown"
      ) {
        setHighlightedIndex(
          Math.min(
            selectedIndex + 1,
            displayOptions.length - 1,
          ),
        );
      }
    }
  }

  const listboxId =
    `${id}-listbox`;

  const labelId =
    `${id}-label`;

  const isActive =
    value !== "All";

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
    >
      {label && (
        <label
          id={labelId}
          className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]"
        >
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={
          label
            ? labelId
            : undefined
        }
        aria-controls={
          open
            ? listboxId
            : undefined
        }
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openMenu();
          }
        }}
        onKeyDown={
          handleTriggerKeyDown
        }
        className={`
          flex
          min-h-[3.25rem]
          w-full
          items-center
          justify-between
          gap-3
          rounded-[var(--radius-lg)]
          border
          px-4
          text-left
          text-sm
          font-medium
          outline-none
          transition-[background-color,border-color,box-shadow]
          duration-200
          ${
            open || isActive
              ? "border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_0_3px_var(--primary-soft)]"
              : "border-[var(--border-strong)] bg-[var(--surface-soft)] hover:border-[var(--text-subtle)]"
          }
          disabled:cursor-not-allowed
          disabled:opacity-50
          focus-visible:border-[var(--primary)]
          focus-visible:ring-2
          focus-visible:ring-[var(--focus-ring)]
        `}
      >
        <span
          className={
            isActive
              ? "text-[var(--text)]"
              : "text-[var(--text-muted)]"
          }
        >
          {selectedLabel}
        </span>

        <ChevronDown
          aria-hidden="true"
          size={18}
          className={`
            shrink-0
            text-[var(--text-muted)]
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[calc(100%+0.5rem)]
            z-50
            overflow-hidden
            rounded-[var(--radius-lg)]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-1.5
            shadow-[var(--shadow-lg)]
          "
        >
          <ul
            id={listboxId}
            role="listbox"
            aria-label={
              label ??
              placeholder
            }
            className="
              max-h-72
              overflow-y-auto
              overscroll-contain
              p-0.5
            "
          >
            {displayOptions.map(
              (
                option,
                index,
              ) => {
                const isSelected =
                  option ===
                  ALL_VALUE
                    ? value === "All"
                    : value ===
                      option;

                const isHighlighted =
                  index ===
                  highlightedIndex;

                const optionLabel =
                  option ===
                  ALL_VALUE
                    ? allLabel
                    : option;

                return (
                  <li
                    key={option}
                    ref={(element) => {
                      optionRefs.current[
                        option
                      ] = element;
                    }}
                    role="option"
                    aria-selected={
                      isSelected
                    }
                    onMouseEnter={() =>
                      setHighlightedIndex(
                        index,
                      )
                    }
                    onClick={() =>
                      selectOption(
                        option,
                      )
                    }
                    className={`
                      flex
                      min-h-11
                      cursor-pointer
                      items-center
                      justify-between
                      gap-3
                      rounded-[var(--radius-md)]
                      px-3.5
                      py-2.5
                      text-sm
                      transition-[background-color,color]
                      duration-100
                      ${
                        isHighlighted
                          ? "bg-[var(--surface-soft)] text-[var(--text)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                      }
                      ${
                        isSelected
                          ? "font-semibold text-[var(--text)]"
                          : ""
                      }
                    `}
                  >
                    <span>
                      {optionLabel}
                    </span>

                    {isSelected && (
                      <Check
                        aria-hidden="true"
                        size={16}
                        className="shrink-0 text-[var(--primary)]"
                        strokeWidth={2.5}
                      />
                    )}
                  </li>
                );
              },
            )}
          </ul>
        </div>
      )}
    </div>
  );
}