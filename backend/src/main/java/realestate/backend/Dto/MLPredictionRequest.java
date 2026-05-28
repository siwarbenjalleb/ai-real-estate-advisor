package realestate.backend.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MLPredictionRequest {

    private Double superficie;
    private Integer chambres;

    @JsonProperty("salles_de_bains")
    private Integer sallesDeBains;

    private String city;
    private String state;
    private String category;
}
