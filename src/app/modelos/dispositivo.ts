export interface Dispositivo {
    disp_id: number;
    disp_chip: string;
    gru_id: number;
    gru_nome?: string;
    prog_id?: number;
    prog_nome?: string;
    disp_status: string;
    disp_status_txt?: string;
    disp_nome?: string;
    disp_ping?: Date;
    disp_versao?: string;
    disp_update?: Date;
}