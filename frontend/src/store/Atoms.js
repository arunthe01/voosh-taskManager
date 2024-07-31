import { atom } from "recoil";

// State to maintain tasks
export const Tasks = atom({
  key: "Tasks",
  default: {
    columns: [
      {
        title: "Todo",
        values: [],
      },
      {
        title: "In Progress",
        values: [],
      },
      {
        title: "Done",
        values: [],
      },
    ],
  },
});

export const isAuthenticated = atom({
  key: "isAuthenticated",
  default: localStorage.getItem("TaskManagerToken")
    ? localStorage.getItem("TaskManagerToken")
    : "",
});

export const navAt = atom({
  key: "navAt",
  default: "login",
});
