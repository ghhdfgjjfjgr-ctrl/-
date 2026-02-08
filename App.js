import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const MODES = [
  { id: "romance", label: "โหมดแฟน" },
  { id: "ntr", label: "โหมด NTR" },
  { id: "spicy", label: "โหมดเร่าร้อน" },
];

const QUICK_PROMPTS = [
  "คุยแบบชัด ๆ เรื่องหีควยตรง ๆ เลย",
  "อยากได้โหมดแฟน ลูบไล้ พูดแรงนิด ๆ",
  "เอาโหมด NTR ดิบ ๆ เล่าให้เสียว",
];

const SYSTEM_NOTE =
  "นี่คือแอปตัวอย่างสำหรับผู้ใหญ่เท่านั้น (18+). ภาษาข้างถนน/หี/ควยได้ แต่ห้ามพูดถึงผู้เยาว์หรือสิ่งผิดกฎหมาย";

export default function App() {
  const [hasConsented, setHasConsented] = useState(false);
  const [mode, setMode] = useState(MODES[0].id);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      id: "welcome",
      role: "system",
      text: "ยินดีต้อนรับสู่ห้องคุย 18+ แบบตรง ๆ หีควยพูดได้",
    },
  ]);

  const selectedMode = useMemo(
    () => MODES.find((item) => item.id === mode),
    [mode]
  );

  const handleSend = () => {
    if (!message.trim()) return;
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message.trim(),
    };

    const assistantReply = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: `รับทราบค่ะ (${selectedMode?.label}) เดี๋ยวฉันจะคุยให้เสียวขึ้นนะคะ`,
    };

    setChat((prev) => [userMessage, assistantReply, ...prev]);
    setMessage("");
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setChat((prev) => [
        {
          id: `system-${Date.now()}`,
          role: "system",
          text: "ต้องอนุญาตเข้าถึงรูปก่อนนะคะถึงจะอัปโหลดได้",
        },
        ...prev,
      ]);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    const imageMessage = {
      id: `image-${Date.now()}`,
      role: "user",
      text: "อัปโหลดรูปเพื่อให้ AI จำรูปลักษณ์",
      imageUri: asset.uri,
    };

    const analysisReply = {
      id: `analysis-${Date.now()}`,
      role: "assistant",
      text:
        "วิเคราะห์ให้แบบตรง ๆ: ภาพนี้โทนสีและแสงดูนุ่ม ๆ ทำให้ลุคดูยั่ว ๆ นิด ๆ " +
        "รายละเอียดส่วนโค้งและเงาชัดขึ้นตรงช่วงลำตัว ทำให้ดูเซ็กซี่ขึ้นค่ะ",
    };

    const assistantReply = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: "รับรูปแล้วนะคะ เดี๋ยวจำรูปลักษณ์ให้ พร้อมคุยให้เสียวขึ้นต่อได้เลย",
    };

    setChat((prev) => [imageMessage, analysisReply, assistantReply, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ห้องคุย 18+ (ไทยตรง ๆ)</Text>
        <Text style={styles.subtitle}>{SYSTEM_NOTE}</Text>
      </View>

      {!hasConsented ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ยืนยันอายุ 18+</Text>
          <Text style={styles.sectionBody}>
            กรุณายืนยันว่าคุณมีอายุ 18 ปีขึ้นไป และยอมรับเนื้อหา 18+ ที่พูดตรง ๆ
          </Text>
          <TouchableOpacity
            onPress={() => setHasConsented(true)}
            style={[styles.primaryButton, styles.fullWidth]}
          >
            <Text style={styles.primaryButtonText}>
              ติ๊กยอมรับ (ฉันอายุ 18+ พร้อมคุยตรง ๆ)
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>เลือกโหมดคุยเสียว</Text>
            <View style={styles.modeRow}>
              {MODES.map((item) => {
                const active = item.id === mode;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setMode(item.id)}
                    style={[styles.modeButton, active && styles.modeButtonActive]}
                  >
                    <Text
                      style={[
                        styles.modeButtonText,
                        active && styles.modeButtonTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>เริ่มบทสนทนาแบบข้างถนน</Text>
            <Text style={styles.sectionBody}>เลือกข้อความตัวอย่างได้เลย</Text>
            <View style={styles.promptRow}>
              {QUICK_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => setMessage(prompt)}
                  style={styles.promptChip}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handlePickImage}
              style={[styles.primaryButton, styles.fullWidth]}
            >
              <Text style={styles.primaryButtonText}>
                อัปโหลดรูปเพื่อให้ AI จำรูปลักษณ์
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chatArea}>
            <FlatList
              data={chat}
              inverted
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.role === "user" && styles.userBubble,
                    item.role === "assistant" && styles.assistantBubble,
                    item.role === "system" && styles.systemBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.messageImage}
                    />
                  ) : null}
                </View>
              )}
            />
            <View style={styles.inputRow}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="พิมพ์ข้อความแบบตรง ๆ ..."
                style={styles.input}
                multiline
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>ส่ง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0F13",
  },
  header: {
    padding: 20,
    gap: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#1B1E27",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionBody: {
    color: "#C7CAD1",
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: "#FF5E7E",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#0E0F13",
    fontWeight: "700",
    textAlign: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  modeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: "#313543",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  modeButtonActive: {
    backgroundColor: "#FF5E7E",
    borderColor: "#FF5E7E",
  },
  modeButtonText: {
    color: "#C7CAD1",
    fontSize: 12,
  },
  modeButtonTextActive: {
    color: "#0E0F13",
    fontWeight: "700",
  },
  promptRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  promptChip: {
    borderRadius: 999,
    backgroundColor: "#252A36",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  promptText: {
    color: "#E5E7EB",
    fontSize: 12,
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#12141B",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: "#FF5E7E",
    alignSelf: "flex-end",
  },
  assistantBubble: {
    backgroundColor: "#2C3141",
    alignSelf: "flex-start",
  },
  systemBubble: {
    backgroundColor: "#1F2937",
    alignSelf: "center",
  },
  messageText: {
    color: "#F8FAFC",
    fontSize: 13,
  },
  messageImage: {
    marginTop: 8,
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#0E0F13",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#FF5E7E",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: "#0E0F13",
    fontWeight: "700",
  },
});
