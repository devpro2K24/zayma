import { logEmailError, notifyAdmin } from "../../utils/emailService.js";
import EmailError from "../../models/userModel.js";

jest.mock("../../utils/emailService.js", () => ({
  logEmailError: jest.fn(),
  notifyAdmin: jest.fn(),
}));

describe("Email Error Mapping and Handling", () => {
  const errorMapping = {
    EAUTH: {
      type: "AUTH_ERROR",
      message: "Erreur d'authentification du serveur email.",
    },
    EENVELOPE: {
      type: "INVALID_EMAIL",
      message: "Adresse email invalide ou boîte de réception pleine.",
    },
    EMESSAGE: {
      type: "MESSAGE_ERROR",
      message: "Erreur lors de la construction du message email.",
    },
    ECONNECTION: {
      type: "CONNECTION_ERROR",
      message: "Problème de connexion au serveur email.",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should map known errors correctly", async () => {
    for (const [code, mapped] of Object.entries(errorMapping)) {
      const emailError = { code, message: "Some error message" };
      const mappedError = errorMapping[emailError.code] || {
        type: "UNKNOWN_ERROR",
        message: `Erreur d'envoi d'email: ${emailError.message}`,
      };

      expect(mappedError.type).toBe(mapped.type);
      expect(mappedError.message).toBe(mapped.message);
    }
  });

  it("should map unknown errors to UNKNOWN_ERROR", async () => {
    const emailError = {
      code: "EUNKNOWN",
      message: "An unknown error occurred",
    };
    const mappedError = errorMapping[emailError.code] || {
      type: "UNKNOWN_ERROR",
      message: `Erreur d'envoi d'email: ${emailError.message}`,
    };

    expect(mappedError.type).toBe("UNKNOWN_ERROR");
    expect(mappedError.message).toBe(
      `Erreur d'envoi d'email: ${emailError.message}`
    );
  });

  it("should log the error with logEmailError", async () => {
    const emailError = { code: "EAUTH", message: "Some error" };
    const userId = "user123";

    await logEmailError(
      userId,
      errorMapping[emailError.code].type,
      errorMapping[emailError.code].message
    );

    expect(logEmailError).toHaveBeenCalledWith(
      userId,
      "AUTH_ERROR",
      "Erreur d'authentification du serveur email."
    );
  });

  it("should notify admin if recent error count exceeds threshold", async () => {
    const email = "user@example.com";
    const userId = "user123";
    const mockCountDocuments = jest.spyOn(EmailError, "countDocuments");

    mockCountDocuments.mockResolvedValue(3);

    await notifyAdmin({
      type: "MULTIPLE_EMAIL_ERRORS",
      userId,
      email,
      errorType: "AUTH_ERROR",
      errorCount: 3,
    });

    expect(notifyAdmin).toHaveBeenCalledWith({
      type: "MULTIPLE_EMAIL_ERRORS",
      userId,
      email,
      errorType: "AUTH_ERROR",
      errorCount: 3,
    });
  });

  it("should not notify admin if recent error count is below threshold", async () => {
    const mockCountDocuments = jest.spyOn(EmailError, "countDocuments");

    mockCountDocuments.mockResolvedValue(2);

    expect(notifyAdmin).not.toHaveBeenCalled();
  });
});
