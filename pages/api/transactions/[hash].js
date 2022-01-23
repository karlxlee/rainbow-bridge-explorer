export async function transaction(hash) {}

export default async function handler(req, res) {
  const { query, method } = req;
  const { tx, error } = await transactions(query.hash);
}
