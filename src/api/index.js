const baseApi = new URL("http://127.0.0.1:9000/v1");

export async function getTodos() {
  try {
    const response = await fetch(`${baseApi}/tasks`);
    if (!response.ok) {
      throw new Error("Bad response error", { cause: response.statusText });
    }
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 201 || response.status === 204) {
      return [];
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * @typedef {{label:String,description:String,end_date:Date,start_date:Date,label:string}} Todo
 * @param {Todo} payload
 * @returns
 */
export async function addTodo(payload) {
  try {
    const response = await fetch(`${baseApi}/tasks`, {
      headers: {
        accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Bad response error", { cause: response.statusText });
    }
    return { message: response.statusText, status: response.status };
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {String} payload
 * @returns
 */
export async function removeTodo(payload) {
  try {
    const response = await fetch(`${baseApi}/tasks/${payload}`, {
      headers: {
        accept: "application/json",
      },
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Bad response error", { cause: response.statusText });
    }
    return { message: response.statusText, status: response.status };
  } catch (err) {
    console.error(err);
  }
}
