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

/*------------------------ */
/* GENERATED LIST SERVICES */
/*------------------------ */

export const generatedListService = {
  saveGeneratedList(list) {
    return apiRequest("/api/generated-lists", {
      method: "POST",
      body: list,
    });
  },

  downloadGeneratedList(id) {
    return fetch(`/api/print/list/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
  fetchGeneratedLists() {
  return apiRequest("/api/generated-lists", {
    method: "GET",
  });
}
};



/* -------------------- */
/* PRINT SERVICES       */
/* -------------------- */

export const printService = {
  printList(list) {
    return apiRequest("/api/print/list", {
      method: "POST",
      body: list,
      responseType: "blob",
    });
  },
};

/* -------------------- */
/* AI SERVICES          */
/* -------------------- */

export const aiService = {
  autoGenerateItem(prompt) {
    return apiRequest("/api/ai/generate-item", {
      method: "POST",
      body: { name: prompt },
    });
  },
};

/* -------------------- */
/* EVENT DATES SERVICES */
/* -------------------- */

export const eventDatesService = {
  getAll() {
    return apiRequest("/api/event-dates");
  },

  getByDate(date) {
    return apiRequest(`/api/event-dates/${date}`);
  },

  saveByDate(date, events) {
    return apiRequest(`/api/event-dates/${date}`, {
      method: "POST",
      body: { events },
    });
  },

  deleteEvent(date, eventId) {
    return apiRequest(`/api/event-dates/${date}/${eventId}`, {
      method: "DELETE",
    });
  },
};