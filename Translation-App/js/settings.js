window.Settings = {
  get(key, fallback=null){
    const data = JSON.parse(localStorage.getItem("appSettings")|| "{}");
    return key in data ? data[key] : fallback;
  },
  set(key, value){
    const data = JSON.parse(localStorage.getItem("appSettings")|| "{}");
    data[key] = value;
    localStorage.setItem("appSettings", JSON.stringify(data));
  },
  reset(){ localStorage.removeItem("appSettings"); }
};