// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

interface List {
  id: number;
  name: string;
}

interface Error {
  message: string;
}

const list = [{ id: 1, name: 'item1' }];

export default function handler(req: NextApiRequest, res: NextApiResponse<List[] | Error>) {
  if (req.method === 'POST') {
    const accessToken = req.body?.accessToken;
    if (accessToken === 'true') {
      list.push({
        id: 2,
        name: 'item2',
      });
      res.status(200).json(list);
    } else {
      res.status(401).json({ message: 'invalide token' });
    }
  } else {
    res.status(200).json(list);
  }
}
