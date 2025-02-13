import { AppDataSource } from "../config/database";
import {LeadRegister} from "../models/LeadRegister";

export const leadRegisterRepository = AppDataSource.getRepository(LeadRegister);