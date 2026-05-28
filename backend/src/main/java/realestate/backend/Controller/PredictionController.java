package realestate.backend.Controller;


import realestate.backend.Entity.Prediction;
import realestate.backend.Service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping("/{propertyId}")
    public ResponseEntity<Prediction> getPrediction(@PathVariable Long propertyId) {
        return ResponseEntity.ok(predictionService.predictForProperty(propertyId));
    }
}
