import { describe, it, expect, vi } from "vitest";
import { findParentKeys, convertMenuItems } from "./utils";
import { MenuItem, SidebarItem } from "./types";
import { DropdownMenuContentProps } from "@components/DropdownMenu/types";

describe("findParentKeys", () => {
  it("should return empty array if target key not found", () => {
    const items: SidebarItem[] = [
      { key: "1", text: "Item 1" },
      { key: "2", text: "Item 2" },
    ];
    expect(findParentKeys(items, "3")).toEqual([]);
  });

  it("should find parent keys for nested items", () => {
    const items: SidebarItem[] = [
      {
        key: "1",
        text: "Item 1",
        subItems: [
          {
            key: "1-1",
            text: "Item 1-1",
            subItems: [{ key: "1-1-1", text: "Item 1-1-1" }],
          },
        ],
      },
    ];
    expect(findParentKeys(items, "1-1-1")).toEqual(["1", "1-1"]);
  });
});

describe("convertMenuItems", () => {
  it("should convert label menu item", () => {
    const items: MenuItem[] = [{ type: "label", text: "Label" }];
    expect(convertMenuItems(items)).toEqual([{ type: "label", text: "Label" }]);
  });

  it("should combine undefined text/selected to empty string", () => {
    const onClick = vi.fn();
    const onCheckChange = vi.fn();
    const onRadioChange = vi.fn();

    const items = [
      { type: "label", text: undefined },
      { type: "item", text: undefined, onClick },
      {
        type: "check",
        text: undefined,
        isCheck: true,
        onChange: onCheckChange,
      },
      { type: "subMenu", text: undefined, subMenuElements: [] },
      {
        type: "radioGroup",
        selected: undefined,
        options: ["1"],
        onChange: onRadioChange,
      },
    ] as unknown as MenuItem[];

    const converted: DropdownMenuContentProps[] = convertMenuItems(items);

    expect(converted[0].type).toBe("label");
    if (converted[0].type !== "label") throw new Error("Expected label");
    expect(converted[0].text).toBe("");

    expect(converted[1].type).toBe("item");
    if (converted[1].type !== "item") throw new Error("Expected item");
    expect(converted[1].text).toBe("");

    expect(converted[2].type).toBe("check");
    if (converted[2].type !== "check") throw new Error("Expected check");
    expect(converted[2].text).toBe("");

    expect(converted[3].type).toBe("subMenu");
    if (converted[3].type !== "subMenu") throw new Error("Expected subMenu");
    expect(converted[3].text).toBe("");

    expect(converted[4].type).toBe("radioGroup");
    if (converted[4].type !== "radioGroup")
      throw new Error("Expected radioGroup");
    expect(converted[4].selected).toBe("");
  });

  it("should convert item menu item", () => {
    const onClick = () => {
      console.log("Item clicked");
    };
    const items: MenuItem[] = [
      {
        type: "item",
        text: "Item",
        onClick,
        rightSlot: "right",
        disable: true,
      },
    ];
    expect(convertMenuItems(items)).toEqual([
      {
        type: "item",
        text: "Item",
        onClick,
        rightSlot: "right",
        disable: true,
      },
    ]);
  });

  it("should convert separator menu item", () => {
    const items: MenuItem[] = [{ type: "separator" }];
    expect(convertMenuItems(items)).toEqual([{ type: "separator" }]);
  });

  it("should convert check menu item", () => {
    const onChange = () => {
      console.log("onChange");
    };
    const items: MenuItem[] = [
      { type: "check", text: "Check", isCheck: true, onChange, disable: true },
    ];
    expect(convertMenuItems(items)).toEqual([
      {
        type: "check",
        text: "Check",
        isCheck: true,
        onChange: expect.any(Function),
        disable: true,
      },
    ]);
  });

  it("should default isCheck to false when undefined", () => {
    const onChange = vi.fn();
    const items = [
      { type: "check", text: "Check", isCheck: undefined, onChange },
    ] as unknown as MenuItem[];

    const converted: DropdownMenuContentProps[] = convertMenuItems(items);
    expect(converted[0].type).toBe("check");
    if (converted[0].type !== "check") throw new Error("Expected check");

    expect(converted[0].isCheck).toBe(false);
  });

  it("should call original onChange when converted onChange is invoked", () => {
    const onChange = vi.fn();
    const items: MenuItem[] = [
      { type: "check", text: "Check", isCheck: true, onChange, disable: false },
    ];

    const converted: DropdownMenuContentProps[] = convertMenuItems(items);
    const first = converted[0];
    expect(first.type).toBe("check");
    if (first.type !== "check") throw new Error("Expected a check menu item");

    first.onChange();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should convert radioGroup menu item", () => {
    const onChange = () => {
      console.log("onChange");
    };
    const items: MenuItem[] = [
      {
        type: "radioGroup",
        selected: "1",
        options: ["1", "2"],
        onChange,
        disable: true,
      },
    ];
    expect(convertMenuItems(items)).toEqual([
      {
        type: "radioGroup",
        selected: "1",
        options: ["1", "2"],
        onChange: expect.any(Function),
        disable: true,
      },
    ]);
  });

  it("should default radioGroup options to empty array when undefined", () => {
    const onChange = vi.fn();
    const items = [
      {
        type: "radioGroup",
        selected: "1",
        options: undefined,
        onChange,
        disable: false,
      },
    ] as unknown as MenuItem[];

    const converted: DropdownMenuContentProps[] = convertMenuItems(items);
    expect(converted[0].type).toBe("radioGroup");
    if (converted[0].type !== "radioGroup") {
      throw new Error("Expected radioGroup");
    }

    expect(converted[0].options).toEqual([]);
  });

  it("should call original onChange with value when converted onChange is invoked", () => {
    const onChange = vi.fn();
    const items: MenuItem[] = [
      {
        type: "radioGroup",
        selected: "1",
        options: ["1", "2"],
        onChange,
        disable: false,
      },
    ];

    const converted: DropdownMenuContentProps[] = convertMenuItems(items);
    const first = converted[0];
    expect(first.type).toBe("radioGroup");
    if (first.type !== "radioGroup") {
      throw new Error("Expected a radioGroup menu item");
    }

    first.onChange("2");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("2");
  });

  it("should convert subMenu menu item", () => {
    const items: MenuItem[] = [
      {
        type: "subMenu",
        text: "SubMenu",
        subMenuElements: [{ type: "label", text: "Sub Label" }],
        disable: true,
      },
    ];
    expect(convertMenuItems(items)).toEqual([
      {
        type: "subMenu",
        text: "SubMenu",
        subMenuElements: [{ type: "label", text: "Sub Label" }],
        disable: true,
      },
    ]);
  });

  it("should default subMenuElements to empty array when undefined", () => {
    const items = [
      {
        type: "subMenu",
        text: "SubMenu",
        subMenuElements: undefined,
      },
    ] as unknown as MenuItem[];

    const converted: DropdownMenuContentProps[] = convertMenuItems(items);
    expect(converted[0].type).toBe("subMenu");
    if (converted[0].type !== "subMenu") {
      throw new Error("Expected subMenu");
    }

    expect(converted[0].subMenuElements).toEqual([]);
  });

  it("should fallback to default item for unknown type", () => {
    const consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    const items = [{ type: "__unknown__" }] as unknown as MenuItem[];
    const converted: DropdownMenuContentProps[] = convertMenuItems(items);

    expect(converted).toHaveLength(1);
    expect(converted[0].type).toBe("item");
    if (converted[0].type !== "item") {
      throw new Error("Expected fallback to be a menu item");
    }

    expect(converted[0].text).toBe("Edit");
    converted[0].onClick();
    expect(consoleSpy).toHaveBeenCalledWith("Edit clicked");

    consoleSpy.mockRestore();
  });
});
