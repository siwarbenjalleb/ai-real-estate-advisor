package realestate.backend.Service;



import realestate.backend.Dto.MLPredictionRequest;
import realestate.backend.Dto.MLPredictionResponse;
import realestate.backend.Entity.Prediction;
import realestate.backend.Entity.Property;
import realestate.backend.Repository.PredictionRepository;
import realestate.backend.Repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final PropertyRepository propertyRepository;
    private final WebClient.Builder webClientBuilder;

    private static final String ML_SERVICE_URL = "http://localhost:8000";

    public Prediction predictForProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Check if prediction already exists
        return predictionRepository.findByProperty(property)
                .orElseGet(() -> callMLServiceAndSave(property));
    }

    private Prediction callMLServiceAndSave(Property property) {
        // Build request for ML service
        MLPredictionRequest request = MLPredictionRequest.builder()
                .superficie(property.getSurface())
                .chambres(property.getRooms())
                .sallesDeBains(1) // default if not available
                .city(extractCity(property.getLocation()))
                .state(extractState(property.getLocation()))
                .category(mapCategory(property.getPropertyType().name()))
                .build();

        // Call ML service
        MLPredictionResponse mlResponse = webClientBuilder.build()
                .post()
                .uri(ML_SERVICE_URL + "/predict")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(MLPredictionResponse.class)
                .block();

        // Save prediction
        Prediction prediction = Prediction.builder()
                .property(property)
                .predictedPrice(mlResponse.getPredictedPrice())
                .investmentScore(mlResponse.getInvestmentScore())
                .roiEstimation(mlResponse.getRoiEstimation())
                .riskLevel(mlResponse.getRiskLevel())
                .build();

        return predictionRepository.save(prediction);
    }

    private String extractCity(String location) {
        if (location != null && location.contains(",")) {
            return location.split(",")[1].trim();
        }
        return location != null ? location : "Tunis";
    }

    private String extractState(String location) {
        if (location != null && location.contains(",")) {
            return location.split(",")[0].trim();
        }
        return "Tunis";
    }

    private String mapCategory(String propertyType) {
        return switch (propertyType) {
            case "APARTMENT" -> "Appartements";
            case "HOUSE" -> "Maisons et Villas";
            case "LAND" -> "Terrains";
            case "COMMERCIAL" -> "Bureaux & Plateaux";
            default -> "Appartements";
        };
    }
}
