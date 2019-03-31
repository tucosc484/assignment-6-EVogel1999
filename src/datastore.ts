
import { Collection, MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const CONNECT_URL = process.env.MONGO_CONNECTION || '';

export class TasksDatastore {
  tasks: Collection;

  constructor(client: MongoClient) {
    this.tasks = client.db('homework').collection('tasks');
  }
  
  static async connect() {
    return new Promise<MongoClient>((resolve, reject) =>
      MongoClient.connect(CONNECT_URL, async (err: Error, client: MongoClient) => {
        if (err) {
          reject(err);
        }
        resolve(client);
      }));
  }

  async createTask(description: string) {
    const task = {
      description: description,
      isComplete: false,
      dateCreated: new Date()
    };
    await this.tasks.insertOne(task);
    return task;
  }

  async getTask(id: string) {
    return await this.tasks.findOne({ _id: new ObjectId(id) });
  }

  async getTasks() {
    return await this.tasks.find({});
  }

  async updateTask(id: string, params: {description: string, isComplete: boolean}) {
    let task = await this.getTask(id);
    task.description = params.description;
    task.isComplete = params.isComplete;
    if (params.isComplete)
      task.dateCompleted = new Date();
    await this.tasks.findOneAndUpdate({ _id: new ObjectId(id) }, task);
  }
}
