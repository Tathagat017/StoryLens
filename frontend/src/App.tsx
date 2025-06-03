import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Container,
  FileInput,
  Group,
  Image,
  Loader,
  MantineProvider,
  Paper,
  Stack,
  Text,
  Title,
  Card,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconPhoto,
  IconUpload,
  IconInfoCircle,
} from "@tabler/icons-react";
import "./App.css";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    story: string;
    image: string;
    audio?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get API URL from environment variable, fallback to localhost:8080
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    setError(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setResult({
          story: response.data.story,
          image: `${apiUrl}${response.data.image}`,
          audio: response.data.audio
            ? `${apiUrl}${response.data.audio}`
            : undefined,
        });
      } else {
        setError("Failed to generate story");
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while processing your image");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider>
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Box ta="center">
            <Title order={1} size="h1" mb="sm">
              📸 StoryLens
            </Title>
            <Text size="lg" c="dimmed">
              Transform your photos into captivating stories with AI-powered
              narration
            </Text>
          </Box>

          {/* Upload Section */}
          <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="md">
              <Group justify="center">
                <IconPhoto size={32} />
                <Title order={2} size="h3">
                  Upload Your Image
                </Title>
              </Group>

              <FileInput
                placeholder="Choose an image file"
                accept="image/*"
                value={file}
                onChange={handleFileSelect}
                leftSection={<IconUpload size={16} />}
                size="lg"
              />

              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={!file || loading}
                size="lg"
                fullWidth
              >
                {loading ? "Generating Story..." : "Generate Story & Audio"}
              </Button>
            </Stack>
          </Paper>

          {/* Loading State */}
          {loading && (
            <Paper shadow="sm" p="xl" radius="md">
              <Stack align="center" gap="md">
                <Loader size="lg" />
                <Text size="lg" fw={500}>
                  Creating your story...
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Our AI is analyzing your image and crafting a unique story
                  with audio narration. This may take a few moments.
                </Text>
              </Stack>
            </Paper>
          )}

          {/* Error State */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {/* Results */}
          {result && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3} c="blue">
                  Your Story
                </Title>

                {/* Generated Image */}
                <Box>
                  <Image
                    src={result.image}
                    alt="Uploaded image"
                    radius="md"
                    style={{ maxHeight: 300, objectFit: "contain" }}
                  />
                </Box>

                {/* Generated Story */}
                <Paper p="md" withBorder>
                  <Text size="md" style={{ lineHeight: 1.6 }}>
                    {result.story}
                  </Text>
                </Paper>

                {/* Audio Player */}
                {result.audio ? (
                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      Listen to your story:
                    </Text>
                    <audio controls style={{ width: "100%" }}>
                      <source src={result.audio} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                ) : (
                  <Alert
                    icon={<IconInfoCircle size="1rem" />}
                    title="Audio Generation"
                    color="yellow"
                  >
                    Audio narration could not be generated for this story.
                  </Alert>
                )}
              </Stack>
            </Card>
          )}

          {/* Footer */}
          <Box ta="center" pt="xl">
            <Text size="sm" c="dimmed">
              Powered by Transformers.js for local AI image analysis and story
              generation
            </Text>
          </Box>
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;
