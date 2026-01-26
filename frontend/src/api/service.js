import {apiRequest} from "./api";

/* -------------------- */
/* AUTH SERVICES        */
/* -------------------- */
export const authService = {
  login(data) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: data,
    });
  },

  getMe() {
    return apiRequest("/api/auth/me");
  },
};

/* -------------------- */
/* ITEM SERVICES        */
/* -------------------- */
export const itemService = {
  getItems() {
    return apiRequest("/api/items");
  },

  upsertItem(item) {
    return apiRequest("/api/items", {
      method: "POST",
      body: item,
    });
  },

  updateItem(id,data) {
    return apiRequest(`/api/items/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  deleteItem(code) {
    return apiRequest(`/api/items/${code}`, {
      method: "DELETE",
    });
  },
};

// -------------------- */
/* PICKLIST SERVICES    */
/* -------------------- */

export const picklistService = {
  get(picklist, category) {
    const q = category ? `?category=${category}` : "";
    return apiRequest(`/api/picklist/${picklist}${q}`);
  },

  add(picklist, data) {
    return apiRequest(`/api/picklist/${picklist}`, {
      method: "POST",
      body: data,
    });
  },

  update(picklist, id, data) {
    return apiRequest(`/api/picklist/${picklist}/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  delete(picklist, id) {
    return apiRequest(`/api/picklist/${picklist}/${id}`, {
      method: "DELETE",
    });
  },
};