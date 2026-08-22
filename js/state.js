/* ============================================================
 * state.js - 全局状态 Store（发布-订阅模式）
 * 实现单向数据流：dispatch(action) → reducers → notify subscribers
 * ============================================================ */
(function() {
  if (window.__REHAB_STATE_LOADED__) return;
  window.__REHAB_STATE_LOADED__ = true;


function createStore(initialState) {
  let state = JSON.parse(JSON.stringify(initialState));
  const subscribers = new Set();
  const listeners = {};

  function getState() {
    return state;
  }

  function setState(newState) {
    state = newState;
    notify();
  }

  function subscribe(listener) {
    subscribers.add(listener);
    return function () {
      subscribers.delete(listener);
    };
  }

  function on(event, handler) {
    if (!listeners[event]) listeners[event] = new Set();
    listeners[event].add(handler);
    return function () {
      listeners[event].delete(handler);
    };
  }

  function emit(event, payload) {
    if (listeners[event]) {
      listeners[event].forEach(function (handler) {
        try { handler(state, payload); } catch (e) { console.error('[Store] event handler error:', e); }
      });
    }
  }

  function notify() {
    subscribers.forEach(function (listener) {
      try { listener(state); } catch (e) { console.error('[Store] subscriber error:', e); }
    });
  }

  function dispatch(action) {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    if (!action || !action.type) {
      console.warn('[Store] dispatch 需要一个带 type 的 action:', action);
      return;
    }
    const handlers = ACTION_HANDLERS[action.type];
    if (handlers) {
      const newState = handlers.reduce(function (s, handler) {
        return handler(s, action.payload, dispatch) || s;
      }, state);
      if (newState !== state) {
        state = newState;
        notify();
        persist();
      }
    } else {
      console.warn('[Store] 未注册的 action type:', action.type);
    }
  }

  function persist() {
    if (window.RehabStorage && window.RehabStorage.isAvailable()) {
      window.RehabStorage.save(state);
    }
  }

  function addReducer(type, handler) {
    if (!ACTION_HANDLERS[type]) ACTION_HANDLERS[type] = [];
    ACTION_HANDLERS[type].push(handler);
  }

  return {
    getState: getState,
    setState: setState,
    subscribe: subscribe,
    on: on,
    emit: emit,
    dispatch: dispatch,
    addReducer: addReducer,
    persist: persist
  };
}

const ACTION_HANDLERS = {};

/* ---------- 通用 Reducers ---------- */
function createGenericReducers(store) {

  store.addReducer('ADD_PATIENT', function (state, payload) {
    if (!payload || !payload.id) return state;
    if (window.Schema.validateRecord(payload, 'patient').length > 0) {
      console.warn('[Store] ADD_PATIENT 校验失败');
      return state;
    }
    return Object.assign({}, state, {
      patients: state.patients.concat([Object.assign({ createdAt: Date.now(), updatedAt: Date.now() }, payload)])
    });
  });

  store.addReducer('UPDATE_PATIENT', function (state, payload) {
    if (!payload || !payload.id) return state;
    return Object.assign({}, state, {
      patients: state.patients.map(function (p) {
        return p.id === payload.id
          ? Object.assign({}, p, payload, { updatedAt: Date.now() })
          : p;
      })
    });
  });

  store.addReducer('REMOVE_PATIENT', function (state, payload) {
    if (!payload) return state;
    return Object.assign({}, state, {
      patients: state.patients.filter(function (p) { return p.id !== payload; }),
      records: state.records.filter(function (r) { return r.patientId !== payload; })
    });
  });

  store.addReducer('ADD_RECORD', function (state, payload) {
    if (!payload || !payload.id) return state;
    if (window.Schema.validateRecord(payload, 'record').length > 0) {
      console.warn('[Store] ADD_RECORD 校验失败');
      return state;
    }
    return Object.assign({}, state, {
      records: [Object.assign({ createdAt: Date.now() }, payload)].concat(state.records)
    });
  });

  store.addReducer('REMOVE_RECORD', function (state, payload) {
    if (!payload) return state;
    return Object.assign({}, state, {
      records: state.records.filter(function (r) { return r.id !== payload; })
    });
  });

  store.addReducer('ADD_TODO', function (state, payload) {
    if (!payload || !payload.id) return state;
    return Object.assign({}, state, {
      todos: [payload].concat(state.todos)
    });
  });

  store.addReducer('UPDATE_TODO', function (state, payload) {
    if (!payload || !payload.id) return state;
    return Object.assign({}, state, {
      todos: state.todos.map(function (t) {
        return t.id === payload.id ? Object.assign({}, t, payload) : t;
      })
    });
  });

  store.addReducer('REMOVE_TODO', function (state, payload) {
    if (!payload) return state;
    return Object.assign({}, state, {
      todos: state.todos.filter(function (t) { return t.id !== payload; })
    });
  });

  store.addReducer('ADD_APPOINTMENT', function (state, payload) {
    if (!payload || !payload.id) return state;
    return Object.assign({}, state, {
      appointments: state.appointments.concat([payload])
    });
  });

  store.addReducer('REMOVE_APPOINTMENT', function (state, payload) {
    if (!payload) return state;
    return Object.assign({}, state, {
      appointments: state.appointments.filter(function (a) { return a.id !== payload; })
    });
  });

  store.addReducer('UPDATE_THERAPIST', function (state, payload) {
    if (!payload) return state;
    return Object.assign({}, state, {
      therapist: Object.assign({}, state.therapist, payload)
    });
  });

  store.addReducer('UPDATE_STATS', function (state, payload) {
    if (!payload) return state;
    return Object.assign({}, state, {
      stats: Object.assign({}, state.stats, payload)
    });
  });

  store.addReducer('ADD_CHECKIN', function (state, payload) {
    if (!payload || !payload.id) return state;
    return Object.assign({}, state, {
      checkins: state.checkins.map(function (c) {
        return c.id === payload.id ? Object.assign({}, c, payload) : c;
      })
    });
  });

  store.addReducer('RESET_STATE', function (state, payload) {
    return payload;
  });

  store.addReducer('HYDRATE', function (state, payload) {
    if (!payload) return state;
    return window.Schema.repairData(payload) || state;
  });
}

window.createStore = createStore;
window.createGenericReducers = createGenericReducers;
})();
