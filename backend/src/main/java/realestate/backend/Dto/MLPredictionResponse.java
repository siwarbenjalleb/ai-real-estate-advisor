package realestate.backend.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MLPredictionResponse {

    @JsonProperty("predicted_price")
    private Double predictedPrice;

    @JsonProperty("investment_score")
    private Integer investmentScore;

    @JsonProperty("roi_estimation")
    private Double roiEstimation;

    @JsonProperty("risk_level")
    private String riskLevel;
}