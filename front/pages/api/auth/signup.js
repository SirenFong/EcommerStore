import connectMongo from "@component/database/conn";
import { User } from "@component/models/User";
import { hash } from "bcrypt";

export default async function handler(req, res) {
  try {
    await connectMongo();
    // Only POST method is accepted
    if (req.method === "POST") {
      if (!req.body) {
        return res.status(400).json({ error: "Bad Request: No data provided" });
      }

      const { name, email, password } = req.body;

      // Check for duplicate user
      const checkExistingUser = await User.findOne({ email });
      if (checkExistingUser) {
        return res.status(422).json({ message: "User already exists" });
      }

      try {
        const user = await User.create({
          name,
          email,
          password: await hash(password, 12),
        });

        res.status(201).json({ status: true, user });
      } catch (err) {
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }
    } else {
      res.status(405).json({
        error: "Method Not Allowed",
        message: "HTTP method not valid",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Connect Fail", details: error.message });
  }
}
