import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateSessionBody } from '@parkguard/schemas';
import { CreateSessionBodySchema } from '@parkguard/schemas';
import { useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Badge } from '@/components/Badge';
import { Button, buttonTextVariants } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useCreateSession } from '../api/createSession';
import { carColors } from '../colors';
import { getConfidenceLevel } from '../utils';

type EntryFormProps = {
  plateNumber: string;
  confidence?: number;
  branchId: string;
  photoRef?: string;
};

export function EntryForm({ plateNumber, confidence, branchId, photoRef }: EntryFormProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const createSession = useCreateSession();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSessionBody>({
    resolver: zodResolver(CreateSessionBodySchema),
    defaultValues: { branchId, plateNumber, confidence, photoRef },
  });

  const onSubmit = async (data: CreateSessionBody) => {
    const session = await createSession.mutateAsync(data);
    if (session) {
      router.replace({
        pathname: '/(tabs)/capure/success',
        params: {
          eventType: 'entry',
        },
      });
    }
  };

  if (createSession.isError) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Something went Wrong',
    });
  }

  const confidenceLevel = confidence ? getConfidenceLevel(confidence) : 'Unknown';

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      className="gap-6 flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 gap-6">
          <View className="gap-1.5">
            <Label>Plate number</Label>
            <Controller
              control={control}
              name="plateNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Plate number"
                  autoCorrect={false}
                  autoCapitalize="characters"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={confidenceLevel !== 'High'}
                  className="h-20 text-3xl border font-jetBrainsMono-Regular border-brand-grey m-0 rounded-md"
                />
              )}
            />
            <Badge
              className={`${confidenceLevel === 'High' ? 'bg-brand-teal/30 border-green-500' : 'bg-yellow-500/30 border-yellow-500'} absolute right-4 -top-1 border w-30 h-7`}
            >
              <Text className="text-sm">{confidenceLevel} Confidence</Text>
            </Badge>
            {errors.plateNumber ? (
              <Text className="text-xs text-red-600">{errors.plateNumber.message}</Text>
            ) : null}
          </View>

          <View className="gap-1.5 ">
            <Label>Model</Label>
            <Controller
              control={control}
              name="model"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="e.g Ford"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className="h-14 text-2xl border border-brand-grey rounded-md "
                />
              )}
            />
            {errors.model ? (
              <Text className="text-xs text-red-600">{errors.model.message}</Text>
            ) : null}
          </View>

          <View className="mt-10">
            <Controller
              control={control}
              name="color"
              render={({ field: { onChange } }) => (
                <View className="flex-row gap-3 flex-wrap">
                  {carColors.map((color) => (
                    <Pressable
                      key={color.hex}
                      onPress={() => {
                        onChange(color.name);
                        setSelectedColor(color.name);
                      }}
                    >
                      <View
                        className="w-12 h-12 rounded-md"
                        style={{
                          backgroundColor: color.hex,
                          borderWidth: selectedColor === color.name ? 3 : 1,
                          borderColor: selectedColor === color.name ? '#0d9488' : 'black',
                        }}
                      />
                    </Pressable>
                  ))}
                </View>
              )}
            />
          </View>

          <Button
            className="mt-auto"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            onPress={() => handleSubmit(onSubmit)}
          >
            <Text className={buttonTextVariants({ variant: 'primary', size: 'lg' })}>
              {isSubmitting ? 'Creating Session' : 'Confirm Entry'}
            </Text>
            <LogIn color={'white'} />
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
