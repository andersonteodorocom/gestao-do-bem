/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logoFull from "@/assets/logo-full.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // <-- Estado para mensagens de erro do login
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message; // Mensagem de sucesso vinda do cadastro

  // A função de login agora é async e chama a API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    if (!email || !password) {
      setError("Email e senha são obrigatórios.");
      return;
    }

    try {
      // 1. Faz a chamada para a rota de login do backend
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta não for OK (ex: 401 Unauthorized), lança um erro
        throw new Error(data.message || "Falha ao fazer login.");
      }

      // 2. Se o login for bem-sucedido, salva o token no localStorage
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);

        // 3. Redireciona para o dashboard
        navigate("/dashboard");
      } else {
        setError("Token de acesso não recebido.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <img
              src={logoFull}
              alt="Gestão do Bem"
              className="h-20 mx-auto mb-4"
            />
            <p className="text-muted-foreground">
              Gerencie sua organização de forma simples e eficiente
            </p>
          </div>

          {/* Alerta para mensagem de sucesso vinda do cadastro */}
          {message && !error && (
            <Alert className="mb-4" variant="default">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Alerta para erros de login */}
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 ..."
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 ..."
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 ..."
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="text-right">
              <Button variant="link" className="text-primary text-sm p-0">
                Esqueceu a senha?
              </Button>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Não tem conta? </span>
            <Link to="/register">
              <Button variant="link" className="text-primary p-0">
                Cadastre sua organização
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
