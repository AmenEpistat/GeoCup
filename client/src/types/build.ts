export interface Build {
    match_type: string;
    height_final_full: number;
    confidence_score: number;
    eco_risk_score: number;
    eco_risk_level: string;
    dense_area: number;
    dense_score: number;
    geometry: any;
}