import { Router, Request, Response } from 'express';
import { BatchControllerBackEnd } from '../convector';
import { Batch } from 'batch-cc';
import { identityId, couchDBView, couchDBHost, couchDBProtocol, couchDBPort } from '../env';
import { BaseStorage } from '@worldsibu/convector-core';
import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { id, name } = req.body;
        const createdAt = new Date();
        const createdBy = 'creator';
        const newBatch = new Batch({ id, name, createdAt, createdBy });
        const result = await BatchControllerBackEnd.create(newBatch);
        res.status(200).send(result);
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).send(err);
    }
});


BaseStorage.current = new CouchDBStorage({
    host: couchDBHost,
    protocol: couchDBProtocol,
    port: couchDBPort
}, couchDBView);

export async function getAllPerson() {
    const viewUrl = '_design/person/_view/all';
    const queryOptions = { startKey: [''], endKey: [''] };

    try {
        const result = <Batch[]>(await Batch.query(Batch, couchDBView, viewUrl, queryOptions));
        return await Promise.all(result.map(item => item.toJSON()));
    } catch (err) {
        console.log(err);
        if (err.code === 'EDOCMISSING') {
            return [];
        } else {
            throw err;
        }
    }
}

router.get('/', async (req: Request, res: Response) => {
    try {
        res.send(await getAllPerson());
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).send(err);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const batchToReturn = new Batch(await BatchControllerBackEnd.get(id));
        res.send(batchToReturn.toJSON());
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).send(err);
    }
});

export const BatchExpressController: Router = router;
