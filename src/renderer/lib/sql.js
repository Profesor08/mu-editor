import mssql from "mssql";

let connectedServer = null;

export const sql = mssql;

export async function connect(server) {
  connectedServer = {
    ...server,
  };

  return await request();
}

export async function request() {
  const pool = await new mssql.ConnectionPool(connectedServer).connect();

  return pool.request();
}

export async function query(queryString = "", params = []) {
  try {
    const req = await request();

    params.forEach(param => {
      if (Array.isArray(param)) {
        const [name, type, value] = param;
        req.input(name, type, value);
      } else if (typeof param === "object") {
        const { name, type, value } = param;
        req.input(name, type, value);
      }
    });

    const response = await req.query(queryString);

    req.parent.close();

    return response;
  } catch (err) {
    console.warn(err);
    throw err;
  }
}

export async function execute(procedureName, input = [], output = []) {
  try {
    const req = await request();

    input.forEach(param => {
      if (Array.isArray(param)) {
        const [name, type, value] = param;
        req.input(name, type, value);
      } else if (typeof param === "object") {
        const { name, type, value } = param;
        req.input(name, type, value);
      }
    });

    output.forEach(param => {
      if (Array.isArray(param)) {
        const [name, type] = param;
        req.output(name, type);
      } else if (typeof param === "object") {
        const { name, type } = param;
        req.output(name, type);
      }
    });

    const response = await req.execute(procedureName);

    req.parent.close();

    return response;
  } catch (err) {
    console.warn(err);
    throw err;
  }
}
