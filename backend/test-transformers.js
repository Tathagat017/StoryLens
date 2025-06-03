const { pipeline } = require("@huggingface/transformers");

async function testTransformersJS() {
  try {
    console.log("Testing Transformers.js TrOCR pipeline...");

    // Initialize the TrOCR pipeline
    const captioner = await pipeline(
      "image-to-text",
      "Xenova/trocr-base-handwritten",
      {
        quantized: true,
      }
    );

    console.log("TrOCR pipeline loaded successfully!");

    // Test with a sample image URL (handwritten text)
    const testImageUrl =
      "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/handwriting.jpg";

    console.log("Performing OCR on test image...");
    const result = await captioner(testImageUrl);

    console.log("OCR result:", result);

    if (Array.isArray(result) && result.length > 0) {
      console.log("✅ Success! Extracted text:", result[0].generated_text);
    } else if (result && result.generated_text) {
      console.log("✅ Success! Extracted text:", result.generated_text);
    } else {
      console.log("❌ No text extracted");
    }
  } catch (error) {
    console.error("❌ Error testing Transformers.js:", error.message);
    console.error("Full error:", error);
  }
}

testTransformersJS();
