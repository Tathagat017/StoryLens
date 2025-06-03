const { pipeline } = require("@huggingface/transformers");

async function testTransformersJS() {
  try {
    console.log(
      "Testing Transformers.js ViT-GPT2 image captioning pipeline..."
    );

    // Initialize the ViT-GPT2 image captioning pipeline
    const captioner = await pipeline(
      "image-to-text",
      "Xenova/vit-gpt2-image-captioning",
      {
        quantized: true,
      }
    );

    console.log("ViT-GPT2 image captioning pipeline loaded successfully!");

    // Test with a sample image URL
    const testImageUrl =
      "https://huggingface.co/datasets/Narsil/image_dummy/resolve/main/parrots.png";

    console.log("Generating caption for test image...");
    const result = await captioner(testImageUrl);

    console.log("Caption result:", result);

    if (Array.isArray(result) && result.length > 0) {
      console.log("✅ Success! Generated caption:", result[0].generated_text);
    } else if (result && result.generated_text) {
      console.log("✅ Success! Generated caption:", result.generated_text);
    } else {
      console.log("❌ No caption generated");
    }
  } catch (error) {
    console.error("❌ Error testing Transformers.js:", error.message);
    console.error("Full error:", error);
  }
}

testTransformersJS();
