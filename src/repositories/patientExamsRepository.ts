import { AppDataSource } from "../config/database";
import { PatientExams } from "../models/PatientExams";
import {Repository} from "typeorm";

export const patientExamsRepository: Repository<PatientExams> = AppDataSource.getRepository(PatientExams);