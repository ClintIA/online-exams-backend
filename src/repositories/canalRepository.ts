import { AppDataSource } from "../config/database";
import {Canal} from "../models/Canal";

export const canalRepository = AppDataSource.getRepository(Canal);