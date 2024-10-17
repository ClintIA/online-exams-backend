import { AppDataSource } from "../config/database";
import { DoctorAvailability } from "../models/DoctorAvailability";
import {Repository} from "typeorm";

export const doctorAvailabilityRepository: Repository<DoctorAvailability> = AppDataSource.getRepository(DoctorAvailability);